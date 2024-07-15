import "./button-spinner.css";

const ButtonSpinner = () => {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-white rounded-full dot delay-0"></div>
      <div className="w-2 h-2 bg-white rounded-full dot delay-150"></div>
      <div className="w-2 h-2 bg-white rounded-full dot delay-300"></div>
    </div>
  );
};

export default ButtonSpinner;
