import React from 'react';
import { ArrowLeft, Target, Users, Globe, Award } from 'lucide-react';

interface AboutAIVAProps {
  onBack: () => void;
}

const AboutAIVA: React.FC<AboutAIVAProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-700 to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={onBack}
            className="w-12 h-12 bg-slate-600 hover:bg-slate-500 rounded-full flex items-center justify-center text-white transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-4xl font-bold text-white">About AIVA</h1>
        </div>

        {/* Our Mission Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed">
            AIVA empowers organizations by creating seamless connections between workers and clients through 
            intelligent automation, real-time collaboration, and data-driven insights. We believe in transforming how 
            teams work and how businesses serve their clients.
          </p>
        </div>

        {/* For Workers and For Clients Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* For Workers */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">For Workers</h2>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Streamlined workflow management</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Real-time team collaboration</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Advanced project tracking</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Automated task distribution</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Performance analytics</span>
              </li>
            </ul>
          </div>

          {/* For Clients */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">For Clients</h2>
            </div>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>24/7 support availability</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Transparent project visibility</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Instant communication channels</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Real-time progress updates</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Comprehensive reporting</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Why Choose AIVA Section */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Why Choose AIVA?</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Enterprise Security */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Enterprise Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Bank-level encryption and compliance with industry standards ensure your data and 
                communications remain secure.
              </p>
            </div>

            {/* Scalable Solutions */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Scalable Solutions</h3>
              <p className="text-gray-600 leading-relaxed">
                From small teams to enterprise organizations, AIVA scales with your 
                business needs and growth.
              </p>
            </div>

            {/* AI-Powered Insights */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">AI-Powered Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Leverage artificial intelligence to gain actionable insights and automate routine 
                tasks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutAIVA;