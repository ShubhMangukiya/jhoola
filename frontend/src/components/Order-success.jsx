import { CheckCircle, Truck, Clock, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrderSuccess() {
  // Sample order data (replace with actual data from your state/API)
  // const orderDetails = {
  //   orderId: "SWNG123456",
  //   estimatedDelivery: "25 December 2023",
  //   customerSupport: "+91 98765 43210"
  // };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Success Icon Section */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 bg-green-100 rounded-full">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-gray-600">
            Thank you for shopping with us. Your order is confirmed.
          </p>
        </div>

        {/* <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-blue-600" />
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Order Number</p>
                <p className="text-lg text-gray-900">{orderDetails.orderId}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="h-6 w-6 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-600" />
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                <p className="text-lg text-gray-900">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Delivery Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </span>
              </div>
              <div className="ml-3">
                <p className="text-gray-600">
                  Your order is being processed and will be shipped soon.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-blue-600" />
                </span>
              </div>
              <div className="ml-3">
                <p className="text-gray-600">
                  You'll receive a confirmation email with tracking details.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0">
                <span className="h-6 w-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-purple-600" />
                </span>
              </div>
              <div className="ml-3">
                <p className="text-gray-600">
                  Need help? Contact our support team at ....
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Shopping Button */}
        <div className="text-center">
          <Link
            to="/allproducts"
            className="inline-block bg-[#562a15] text-white px-8 py-3 rounded-md 
                     hover:bg-[#4A2208] transition-colors duration-200 text-lg font-medium"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}