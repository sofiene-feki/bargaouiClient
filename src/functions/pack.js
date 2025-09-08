// Minimal mock to run locally
export const getPack = async (slug) => {
  // You can ignore slug here since we're returning static data
  const data = {
    title: "طاقم العمرة متكون من ثلاث قطع",
    description: "pack ydawakh",
    products: [
      {
        title: " نعال",
        color: [{ name: "red", value: "", alt: "", type: "image", _id: null }],
        sizes: ["39 ", "40", "41", "42", "43"],
      },
      {
        title: "مناشف الإحرام (الإزار والرداء)    ",
        color: [
          {
            name: "Bleu ",
            value: "#01c7fc",
            src: "",
            alt: "IMG_5428.jpeg",
            type: "image",
            _id: "68b8a52e7d3797cdff465f99",
          },
          {
            name: "Rose move ",
            value: "#f4a4c0",
            src: "/uploads/media/1756932918061-IMG_5419.jpeg",
            alt: "IMG_5419.jpeg",
            type: "image",
            _id: null,
          },
          {
            name: "Bordeaux ",
            value: "#3c071b",
            src: "/uploads/media/1756932918074-IMG_5420.jpeg",
            alt: "IMG_5420.jpeg",
            type: "image",
            _id: null,
          },
          {
            name: "Vert pastelle",
            value: "#b1dd8b",
            src: "/uploads/media/1756932918083-IMG_5414.jpeg",
            alt: "IMG_5414.jpeg",
            type: "image",
            _id: null,
          },
          {
            name: "Orange  ",
            value: "#eb4d3d",
            src: "/uploads/media/1756932918120-IMG_5418.jpeg",
            alt: "IMG_5418.jpeg",
            type: "image",
            _id: null,
          },
        ],
        sizes: [
          "6 mois ",
          "1 ans ",
          "2-3 ans ",
          "4-5 ans ",
          "6-7 ans ",
          "8-9 ans ",
        ],
      },
      {
        title: "حزام العثيمين",
        color: [],
        sizes: [
          "6 mois ",
          "1 ans ",
          "2-3 ans ",
          "4-5 ans ",
          "6-7 ans ",
          "8-9 ans ",
        ],
      },
    ],
    price: 150,
    // In your component we normalize media to array, so single object is fine
    media: {
      src: "blob:http://10.203.19.66:5173/8e88ad66-938b-4095-af4d-4d67fddfa674",
      alt: "bnoir.jpg",
      type: "image",
      file: {},
    },
  };
  return { data };
};

export const packCreate = async (formData) => {
  console.log("🧪 packCreate mock called:", [...formData.entries()]);
  // return a fake slug to navigate after create
  return { data: { slug: "pack-laamor" } };
};

export const updatePack = async (slug, formData) => {
  console.log("🧪 updatePack mock called:", slug, [...formData.entries()]);
  return { data: { ok: true } };
};

export const removePack = async (slug) => {
  console.log("🧪 removePack mock called:", slug);
  return { data: { ok: true } };
};
