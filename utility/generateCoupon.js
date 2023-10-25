export function generateCouponCode() {

    const date = new Date();
    const year = date.getFullYear().toString().slice(-2); // Yılın son iki hanesi
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ay (1-12 arasında)
    const day = date.getDate().toString().padStart(2, '0'); // Gün (1-31 arasında)
    const hours = date.getHours().toString().padStart(2, '0'); // Saat (00-23 arasında)
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Dakika (00-59 arasında)
    const seconds = date.getSeconds().toString().padStart(2, '0'); // Saniye (00-59 arasında)

    // Harf-sayı eşleştirmesi
    const charMap = {
        '0': 'A',
        '1': 'B',
        '2': 'C',
        '3': 'D',
        '4': 'E',
        '5': 'F',
        '6': 'G',
        '7': 'H',
        '8': 'I',
        '9': 'J',
    };

    // Saliseyi rastgele bir değer olarak oluştur (0-999 arasında)
    const salise = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    const couponDate = (year + month + day + hours + minutes + seconds + salise).toString();
  
    let couponCode = '';
    
    for (let i = 0; i < couponDate.length; i++) {
        const digit = couponDate[i];
        if (charMap.hasOwnProperty(digit)) {
            couponCode += charMap[digit];
        } else {
            couponCode += digit; // Eğer karakter map'te yoksa, aynı karakteri kullan
        }
    }

    return couponCode;
}
