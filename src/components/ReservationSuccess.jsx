const ReservationSuccess = () => {
    return (
      <div className="container mx-auto p-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 text-center">
            <div className="text-green-500 text-5xl mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Reservation Confirmed!</h1>
            
            <p className="text-lg mb-6">
              Thank you for your reservation. A confirmation email has been sent to your registered email address.
            </p>
            
            <div className="mb-6 bg-gray-50 p-4 rounded text-left">
              <p className="text-gray-700">
                Please check your email for the details of your reservation. If you don't see the email in your inbox, please check your spam folder.
              </p>
            </div>
            
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-center">
              <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded"
              >
                Browse More Restaurants
              </Link>
              
              <Link
                to="/my-reservations"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded"
              >
                View My Reservations
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ReservationSuccess;