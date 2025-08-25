'use client';

import React, { useState, useEffect } from 'react';
import { X, Coffee, Heart, Globe, CreditCard } from 'lucide-react';
import config from '@/lib/config';

interface CoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

const CoffeeModal: React.FC<CoffeeModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    message: ''
  });
  const [order, setOrder] = useState<PaymentOrder | null>(null);
  const [error, setError] = useState('');

  // Load Razorpay script
  useEffect(() => {
    if (!isOpen) return;

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Create payment order
      const response = await fetch(`${config.api.baseUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 500, // $5.00 in cents
          currency: 'USD',
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          message: formData.message
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create order');
      }

      setOrder(data.order);
      setStep('payment');
      initializeRazorpay(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeRazorpay = (orderData: PaymentOrder) => {
    const options = {
      key: config.razorpay.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'AI Analyzer',
      description: 'Buy me a coffee! ☕',
      order_id: orderData.id,
      prefill: {
        name: formData.customerName,
        email: formData.customerEmail,
      },
      notes: {
        message: formData.message || 'Buy me a coffee! ☕'
      },
      theme: {
        color: '#3B82F6'
      },
      handler: async function (response: any) {
        try {
          // Verify payment
          const verifyResponse = await fetch(`${config.api.baseUrl}/api/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              customerName: formData.customerName,
              customerEmail: formData.customerEmail,
              message: formData.message
            }),
          });

          const verifyData = await verifyResponse.json();

          if (verifyData.success) {
            setStep('success');
          } else {
            setError('Payment verification failed');
            setStep('form');
          }
        } catch (err) {
          setError('Payment verification failed');
          setStep('form');
        }
      },
      modal: {
        ondismiss: function() {
          setStep('form');
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      message: ''
    });
    setStep('form');
    setError('');
    setOrder(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <Coffee className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-semibold text-gray-900">Buy Me a Coffee</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Coffee className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Support the Project! ☕
                </h3>
                <p className="text-gray-600 text-sm">
                  If you find this tool helpful, consider buying me a coffee for $5. 
                  Your support helps keep this project running!
                </p>
              </div>

              <div>
                <label htmlFor="customerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="customerEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  id="customerEmail"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Leave a message or feedback..."
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
                <Globe className="w-4 h-4" />
                <span>Accepts payments from all over the world</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 text-white py-3 px-4 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Coffee className="w-5 h-5" />
                    <span>Buy Coffee for $5</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'payment' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Redirecting to Payment...
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                You will be redirected to Razorpay's secure payment gateway.
              </p>
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Thank You! 🎉
              </h3>
              <p className="text-gray-600 text-sm mb-6">
                Your coffee purchase was successful! Thank you for supporting the project. 
                You'll receive a confirmation email shortly.
              </p>
              <button
                onClick={resetForm}
                className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Buy Another Coffee
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoffeeModal;
