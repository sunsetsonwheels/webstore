function separateArrayCommas (array) {
  var separated = '';
  const arrayLength = array.length;
  array.forEach((value, i) => {
    if (i + 1 < arrayLength) {
      separated += value + ', ';
    } else {
      separated += value;
    }
  });
  return separated;
}

function generateReadableCategories (categories) {
  const rawCategories = []
  for (const index in categories) {
    const categoryRawName = categories[index]
    const categoryFriendlyName = StoreDbAPI.db.categories[categoryRawName].name
    if (categoryFriendlyName) {
      rawCategories.push(categoryFriendlyName)
    } else {
      rawCategories.push(categoryRawName)
    }
  }
  return separateArrayCommas(rawCategories)
}

function listAppsByCategory (category, sort) {
  return StoreDbAPI.sortApps(StoreDbAPI.getAppsByCategory(category), sort)
}