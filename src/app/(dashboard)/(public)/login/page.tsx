import { LoginForm } from '../../../../components/loginForm';

const page = () => {
  return (
    /* flex: Enables flexbox
       items-center: Centers vertically
       justify-center: Centers horizontally 
    */
    <div className="min-h-screen bg-gray-900 text-white p-5 flex items-center justify-center">
      <LoginForm />
    </div>
  );
}

export default page;