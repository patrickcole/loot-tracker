let lang = [
  {
    title: 'en',
    values: {
      item: "Item",
      items: "Items",
      location: "Location",
      locations: "Locations",
      title: "Title",
      slug: "ID",
      coordinates: "Coordinates",
      editorCoordinates: "Coordinates",
      listings: "Listings"
    }
  },
  {
    title: 'fr',
    values: {
      item: "Article",
      items: "Articles",
      location: "Emplacement",
      locations: "Emplacements",
      title: "Titre",
      slug: "ID",
      coordinates: "Les coordonnées",
      editorCoordinates: "Les coordonnées",
      listings: "Inscriptions"
    }
  }
];

const i18n = (input_lang) => lang.find( item => item.title === input_lang );

export default i18n;
