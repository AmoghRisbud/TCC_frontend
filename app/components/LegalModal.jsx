'use client';

export default function LegalModal({ title, content, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-[90%] max-w-3xl
                   bg-white text-gray-800
                   rounded-2xl shadow-2xl
                   p-6 md:p-8"
      >
        <h2 className="text-2xl font-bold mb-4 text-brand-dark">
          {title}
        </h2>

        {/* Scrollable content */}
        <div className="max-h-[60vh] overflow-y-auto pr-2 text-sm leading-relaxed">
          {content}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg
                       bg-brand-secondary text-white
                       hover:opacity-90 transition"
          >
            Accept & Close
          </button>
        </div>
      </div>
    </div>
  );
}
