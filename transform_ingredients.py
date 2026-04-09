import json
import re

# Load the ingredient database
with open('/home/vivek/Skinshy/ingredient_database.json', 'r') as f:
    ingredient_db = json.load(f)['ingredients']

# Create a normalized lookup dictionary
def normalize_name(name):
    """Normalize ingredient name for lookup"""
    return name.strip().lower().replace(' / ', '/').replace('/', '').replace(' ', '')

# Build lookup with all aliases
ingredient_lookup = {}
for ing_name, ing_data in ingredient_db.items():
    # Add main name
    ingredient_lookup[normalize_name(ing_name)] = ing_data
    # Add aliases
    for alias in ing_data.get('aliases', []):
        ingredient_lookup[normalize_name(alias)] = ing_data

def get_ingredient_data(ingredient_name):
    """Get ingredient data with best match"""
    normalized = normalize_name(ingredient_name)
    
    # Exact match
    if normalized in ingredient_lookup:
        return ingredient_lookup[normalized]
    
    # Partial matches (contains logic)
    best_match = None
    best_match_len = 0
    
    for db_key, db_data in ingredient_lookup.items():
        if db_key in normalized:
            if len(db_key) > best_match_len:
                best_match = db_data
                best_match_len = len(db_key)
    
    if best_match:
        return best_match
    
    # Default for unknown ingredients
    return {
        "category": "B",
        "reactivity": 2,
        "potency": "moderate",
        "class": "unknown",
        "allergen": False,
        "aliases": []
    }

# Load original products file
with open('/home/vivek/Skinshy/Products_ingrediant.json', 'r') as f:
    content = f.read()
    # Wrap in brackets if not already
    content = content.strip()
    if not content.startswith('['):
        content = '[' + content + ']'
    # Fix trailing commas
    content = re.sub(r',(\s*[}\]])', r'\1', content)
    products = json.loads(content)

# Transform the data
transformed_products = []

for idx, product in enumerate(products):
    new_product = {
        "product_name": product.get("product_name", ""),
        "product_url": product.get("product_url", ""),
        "product_type": product.get("product_type", ""),
        "price": product.get("price", ""),
        "ingredients": []
    }
    
    # Parse ingredients string
    ingredients_str = product.get("ingredients", "")
    if ingredients_str:
        # Split by comma and clean
        ing_list = [ing.strip() for ing in ingredients_str.split(',')]
        
        for position, ing_name in enumerate(ing_list, 1):
            ing_data = get_ingredient_data(ing_name)
            
            ingredient_obj = {
                "position": position,
                "name": ing_name,
                "category_type": ing_data.get("category"),
                "reactivity_score": ing_data.get("reactivity"),
                "potency_level": ing_data.get("potency"),
                "ingredient_class": ing_data.get("class"),
                "known_allergen": ing_data.get("allergen"),
                "allergen_group": ing_data.get("allergen_group")
            }
            
            new_product["ingredients"].append(ingredient_obj)
    
    transformed_products.append(new_product)
    
    if (idx + 1) % 200 == 0:
        print(f"  Processing {idx + 1}/{len(products)}...", flush=True)

# Save transformed file
with open('/home/vivek/Skinshy/Products_ingrediant_transformed.json', 'w') as f:
    json.dump(transformed_products, f, indent=2)

print(f"\n✓ Successfully transformed {len(transformed_products)} products")
print(f"\n✓ Sample product:")
if transformed_products:
    sample = transformed_products[0]
    print(f"  Product: {sample['product_name']}")
    print(f"  Total ingredients: {len(sample['ingredients'])}")
    print(f"  First 5 ingredients:")
    for ing in sample['ingredients'][:5]:
        print(f"    - Pos {ing['position']}: {ing['name']}")
        print(f"      Category: {ing['category_type']}, Reactivity: {ing['reactivity_score']}, Potency: {ing['potency_level']}")
        print(f"      Class: {ing['ingredient_class']}, Allergen: {ing['known_allergen']}")
