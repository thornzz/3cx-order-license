function mergeJSONObjects(firstJSON, secondJSON) {

  // İlk JSON nesnesinin Items özelliği var mı kontrol edin
  if (firstJSON && firstJSON[0] && firstJSON[0].Items) {
      // İlk JSON nesnesinin Items özelliğine sahip olan ilk öğeyi kullanın
      const firstItem = firstJSON[0].Items[0];

      // İkinci JSON nesnesinin Items özelliği var mı kontrol
      if (secondJSON && secondJSON.Items) {
          for (let i = 0; i < secondJSON.Items.length; i++) {
              const secondItem = secondJSON.Items[i];

              // İlk JSON nesnesinden alınan özellikleri ikinci JSON nesnesine kopyalayın
              secondItem.ResellerName = firstItem.ResellerName || '';
              secondItem.ResellerId = firstItem.ResellerId;
              secondItem.DateTime = new Date();
              secondItem.InvoiceId = null;
          }
      }
  }
}

export default mergeJSONObjects