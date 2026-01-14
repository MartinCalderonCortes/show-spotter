
const ErrorMessage = ({ message }: {message : string}) => {
  return (
    <div className="alert alert-error my-4">
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;