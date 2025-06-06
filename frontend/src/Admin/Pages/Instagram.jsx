import React, { useEffect, useState } from "react";
import { API_URL } from "../../components/Variable";

const AdminPanel = () => {
const [reels, setReels] = useState(
  Array(5).fill(null).map(() => ({ image: null, preview: "", link: "", alt: "" }))
);


  const fetchData = async () => {
    const res = await fetch(`${API_URL}/api/instagram`);
    const data = await res.json();

    if (data) {
      const updated = [
        { preview: data.reel1Image, link: data.reel1Link, alt: data.reel1Alt },
        { preview: data.reel2Image, link: data.reel2Link, alt: data.reel2Alt },
        { preview: data.reel3Image, link: data.reel3Link, alt: data.reel3Alt },
        { preview: data.reel4Image, link: data.reel4Link, alt: data.reel4Alt },
        { preview: data.reel5Image, link: data.reel5Link, alt: data.reel5Alt },
      ];
      setReels((prev) =>
        prev.map((_, i) => ({ ...updated[i], image: null }))
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (i, key, value) => {
    const updated = [...reels];
    updated[i][key] = value;
    setReels(updated);
  };

  const handleFile = (i, file) => {
    const updated = [...reels];
    updated[i].image = file;
    updated[i].preview = URL.createObjectURL(file);
    setReels(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();

    reels.forEach((r, i) => {
      if (r.image) form.append(`reel${i + 1}Image`, r.image);
      form.append(`reel${i + 1}Link`, r.link);
      form.append(`reel${i + 1}Alt`, r.alt);
    });

    const res = await fetch(`${API_URL}/api/instagram`, {
      method: "PUT",
      body: form,
    });

    if (res.ok) alert("Reels updated!");
    else alert("Update failed");
  };

  // Clean up old object URLs to avoid memory leaks
  React.useEffect(() => {
    return () => {
      reels.forEach((reel) => {
        if (reel.preview && reel.preview.startsWith("blob:")) {
          URL.revokeObjectURL(reel.preview);
        }
      });
    };
  }, [reels]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {reels.map((reel, i) => (
  <div key={i} className="bg-white shadow p-4 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
    
    <div>
      {/* Show preview if selected */}
      {reel.preview && (
        <img
          src={
            reel.preview.startsWith("blob:")
              ? reel.preview
              : `${API_URL}${reel.preview}`
          }
          alt={`Reel ${i + 1} preview`}
          className="h-24 rounded mb-2"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files[0]) {
            const file = e.target.files[0];
            const updated = [...reels];
            updated[i].image = file;
            updated[i].preview = URL.createObjectURL(file);
            setReels(updated);
          }
        }}
        className="block w-full text-sm text-gray-500 file:mr-2 file:py-1 file:px-3 file:border-0 file:bg-blue-600 file:text-white file:rounded file:cursor-pointer"
      />
    </div>
    {/* Inputs for link and alt text */}
    <input
      type="text"
      value={reel.link}
      onChange={(e) => {
        const updated = [...reels];
        updated[i].link = e.target.value;
        setReels(updated);
      }}
      placeholder={`Reel ${i + 1} Link`}
      className="p-2 border rounded"
      required
    />
    <input
      type="text"
      value={reel.alt}
      onChange={(e) => {
        const updated = [...reels];
        updated[i].alt = e.target.value;
        setReels(updated);
      }}
      placeholder={`Reel ${i + 1} Alt Text`}
      className="p-2 border rounded"
      required
    />
  </div>
))}

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700"
        >
          Save Reels
        </button>
      </form>
    </div>
  );
};

export default AdminPanel;
