import { useNavigate } from "react-router-dom";

const BackButton = ({ text, path }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full "><button
      onClick={() => navigate(path)}
      className="mb-6 sm:mb-8 md:pl-5 flex justify-start items-start text-custom-charcoal hover:text-custom-dark-gray transition text-sm sm:text-base"
    >
      {text}
    </button></div>
  );
};

export default BackButton;