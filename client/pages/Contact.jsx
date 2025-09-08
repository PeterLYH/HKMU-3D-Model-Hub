import ContactForm from '../components/ContactForm';

function Contact() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Contact - HKMU 3D Model Hub</h1>
        <ContactForm />
      </div>
    </div>
  );
}

export default Contact;