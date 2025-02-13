/*
 * Surge 網路詳情面板
 * @Nebulosa-Cat
 * 詳情請見 README
 */
const { wifi, v4, v6 } = $network;

let cellularInfo = '';
//整理邏輯:前三碼相同->後兩碼同電信->剩下的
const carrierNames = {
  //台灣電信業者 Taiwan
  '466-11': '中華電信', '466-92': '中華電信',
  '466-01': '遠傳電信', '466-03': '遠傳電信',
  '466-97': '台灣大哥大', '466-89': '台灣之星', '466-05': '亞太電信',
  //中國電信業者 Cahin
  '460-03': '中國電信', '460-05': '中國電信', '460-11': '中國電信',
  '460-01': '中國聯通', '460-06': '中國聯通', '460-09': '中國聯通',
  '460-00': '中國移動', '460-02': '中國移動', '460-04': '中國移動', '460-07': '中國移動', '460-08': '中國移動',
  '460-15': '中國廣電', '460-20': '中國鐵通',
  //香港電信業者 HongKong
  '454-00': 'CSL', '454-02': 'CSL', '454-18': 'CSL',
  '454-03': '3HK', '454-04': '3HK', '454-05': '3HK',
  '454-06': 'SmarTone', '454-15': 'SmarTone', '454-17': 'SmarTone',
  '454-12': 'CMHK', '454-13': 'CMHK', '454-28': 'CMHK',
  '454-16': 'PCCW', '454-19': 'PCCW', '454-20': 'PCCW', '454-29': 'PCCW',
  '454-01': '中信國際電訊', '454-07': '中國聯通', '454-08': 'Truphone', '454-09': 'China Motion', '454-10': 'Sun Mobile', '454-11': 'CHKTL', '454-23': 'Lycamobile', '454-31': 'CTExcel',
  //日本電信業者 Japan
  '440-00': 'Y-Mobile', '400-10': 'NTT DOCOMO', '400-11': 'Rakuten', '400-20': 'SoftBank	',
  '400-50': 'KDDI', '400-51': 'KDDI', '400-52': 'KDDI', '400-53': 'KDDI', '400-54': 'KDDI',
  '441-00': 'WCP', '441-10': 'UQ WiMAX',
  //韓國電信業者 Korea
  '450-03': 'SK Telecom', '450-05': 'SK Telecom',
  '450-04': 'KTF', '450-08': 'KTF', '450-02': 'KTF',
  '450-06': 'LG U+', '467-193': 'Sun Net',
  //美國電信業者 USA
  '310-850': 'Aeris Comm. Inc.', '310-510': 'Airtel Wireless LLC', '312-090': 'Allied Wireless Communications Corporation', '310-710': 'Arctic Slope Telephone Association Cooperative Inc.', '310-070': 'AT&T Wireless Inc.', '310-150': 'AT&T Wireless Inc.', '310-170': 'AT&T Wireless Inc.', '310-380': 'AT&T Wireless Inc.', '310-410': 'AT&T Wireless Inc.', '310-560': 'AT&T Wireless Inc.', '310-680': 'AT&T Wireless Inc.', '310-980': 'AT&T Wireless Inc.', '311-440': 'Bluegrass Wireless LLC', '311-800': 'Bluegrass Wireless LLC', '311-810': 'Bluegrass Wireless LLC', '310-900': 'Cable & Communications Corp.', '311-590': 'California RSA No. 3 Limited Partnership', '311-500': 'Cambridge Telephone Company Inc.', '310-830': 'Caprock Cellular Ltd.', '312-270': 'Cellular Network Partnership LLC', '312-280': 'Cellular Network Partnership LLC', '310-360': 'Cellular Network Partnership LLC', '311-120': 'Choice Phone LLC', '310-480': 'Choice Phone LLC', '310-420': 'Cincinnati Bell Wireless LLC', '310-180': 'Cingular Wireless', '310-620': 'Coleman County Telco /Trans TX', '310-06': 'Consolidated Telcom', '310-60': 'Consolidated Telcom', '310-700': 'Cross Valliant Cellular Partnership', '312-030': 'Cross Wireless Telephone Co.', '311-140': 'Cross Wireless Telephone Co.', '312-040': 'Custer Telephone Cooperative Inc.', '310-440': 'Dobson Cellular Systems', '310-990': 'E.N.M.R. Telephone Coop.', '312-120': 'East Kentucky Network LLC', '312-130': 'East Kentucky Network LLC', '310-750': 'East Kentucky Network LLC', '310-090': 'Edge Wireless LLC', '310-610': 'Elkhart TelCo. / Epic Touch Co.', '311-311': 'Farmers', '311-460': 'Fisher Wireless Services Inc.', '311-370': 'GCI Communication Corp.', '310-430': 'GCI Communication Corp.', '310-920': 'Get Mobile Inc.', '311-340': 'Illinois Valley Cellular RSA 2 Partnership', '312-170': 'Iowa RSA No. 2 Limited Partnership', '311-410': 'Iowa RSA No. 2 Limited Partnership', '310-770': 'Iowa Wireless Services LLC', '310-650': 'Jasper', '310-870': 'Kaplan Telephone Company Inc.', '312-180': 'Keystone Wireless LLC', '310-690': 'Keystone Wireless LLC', '311-310': 'Lamar County Cellular', '310-016': 'Leap Wireless International Inc.', '310-040': 'Matanuska Tel. Assn. Inc.', '310-780': 'Message Express Co. / Airlink PCS', '311-330': 'Michigan Wireless LLC', '310-400': 'Minnesota South. Wirel. Co. / Hickory', '311-010': 'Missouri RSA No 5 Partnership', '312-010': 'Missouri RSA No 5 Partnership', '311-020': 'Missouri RSA No 5 Partnership', '312-220': 'Missouri RSA No 5 Partnership', '311-920': 'Missouri RSA No 5 Partnership', '310-350': 'Mohave Cellular LP', '310-570': 'MTPCS LLC', '310-290': 'NEP Cellcorp Inc.', '310-34': 'Nevada Wireless LLC', '310-600': 'New-Cell Inc.', '311-300': 'Nexus Communications Inc.', '310-130': 'North Carolina RSA 3 Cellular Tel. Co.', '312-230': 'North Dakota Network Company', '311-610': 'North Dakota Network Company', '310-450': 'Northeast Colorado Cellular Inc.', '311-710': 'Northeast Wireless Networks LLC', '310-011': 'Northstar', '310-670': 'Northstar', '311-420': 'Northwest Missouri Cellular Limited Partnership', '310-760': 'Panhandle Telephone Cooperative Inc.', '310-580': 'PCS ONE', '311-170': 'PetroCom', '311-670': 'Pine Belt Cellular, Inc.', '310-100': 'Plateau Telecommunications Inc.', '310-940': 'Poka Lambro Telco Ltd.', '310-500': 'Public Service Cellular Inc.', '312-160': 'RSA 1 Limited Partnership', '311-430': 'RSA 1 Limited Partnership', '311-350': 'Sagebrush Cellular Inc.', '310-46': 'SIMMETRY', '311-260': 'SLO Cellular Inc / Cellular One of San Luis', '310-320': 'Smith Bagley Inc.', '316-011': 'Southern Communications Services Inc.', '316-010': 'Sprint Spectrum', '310-120': 'Sprint Spectrum', '312-190': 'Sprint Spectrum', '311-490': 'Sprint Spectrum', '312-530': 'Sprint Spectrum', '311-870': 'Sprint Spectrum', '311-880': 'Sprint Spectrum', '310-740': 'Telemetrix Inc.', '310-14': 'Testing', '310-860': 'Texas RSA 15B2 Limited Partnership', '311-050': 'Thumb Cellular Limited Partnership', '311-830': 'Thumb Cellular Limited Partnership', '310-31': 'T-Mobile', '310-160': 'T-Mobile', '310-200': 'T-Mobile', '310-210': 'T-Mobile', '310-220': 'T-Mobile', '310-230': 'T-Mobile', '310-240': 'T-Mobile', '310-250': 'T-Mobile', '310-260': 'T-Mobile', '310-270': 'T-Mobile', '310-280': 'T-Mobile', '310-300': 'T-Mobile', '310-310': 'T-Mobile', '310-330': 'T-Mobile', '310-660': 'T-Mobile', '310-800': 'T-Mobile', '310-460': 'TMP Corporation', '310-490': 'Triton PCS', '312-290': 'Uintah Basin Electronics Telecommunications Inc.', '311-860': 'Uintah Basin Electronics Telecommunications Inc.', '310-960': 'Uintah Basin Electronics Telecommunications Inc.', '310-020': 'Union Telephone Co.', '311-220': 'United States Cellular Corp.', '310-730': 'United States Cellular Corp.', '311-650': 'United Wireless Communications Inc.', '310-003': 'Unknown', '310-15': 'Unknown', '310-23': 'Unknown', '310-24': 'Unknown', '310-25': 'Unknown', '310-26': 'Unknown', '310-190': 'Unknown', '310-950': 'Unknown', '310-38': 'USA 3650 AT&T', '310-999': 'Various Networks', '310-520': 'VeriSign', '310-004': 'Verizon Wireless', '310-010': 'Verizon Wireless', '310-012': 'Verizon Wireless', '310-013': 'Verizon Wireless', '311-110': 'Verizon Wireless', '311-270': 'Verizon Wireless', '311-271': 'Verizon Wireless', '311-272': 'Verizon Wireless', '311-273': 'Verizon Wireless', '311-274': 'Verizon Wireless', '311-275': 'Verizon Wireless', '311-276': 'Verizon Wireless', '311-277': 'Verizon Wireless', '311-278': 'Verizon Wireless', '311-279': 'Verizon Wireless', '311-280': 'Verizon Wireless', '311-281': 'Verizon Wireless', '311-282': 'Verizon Wireless', '311-283': 'Verizon Wireless', '311-284': 'Verizon Wireless', '311-285': 'Verizon Wireless', '311-286': 'Verizon Wireless', '311-287': 'Verizon Wireless', '311-288': 'Verizon Wireless', '311-289': 'Verizon Wireless', '311-390': 'Verizon Wireless', '311-480': 'Verizon Wireless', '311-481': 'Verizon Wireless', '311-482': 'Verizon Wireless', '311-483': 'Verizon Wireless', '311-484': 'Verizon Wireless', '311-485': 'Verizon Wireless', '311-486': 'Verizon Wireless', '311-487': 'Verizon Wireless', '311-488': 'Verizon Wireless', '311-489': 'Verizon Wireless', '310-590': 'Verizon Wireless', '310-890': 'Verizon Wireless', '310-910': 'Verizon Wireless', '310-530': 'West Virginia Wireless', '310-340': 'Westlink Communications, LLC', '311-070': 'Wisconsin RSA #7 Limited Partnership', '310-390': 'Yorkville Telephone Cooperative',
  //英國電信業者 UK
  '234-01': 'Vectone', '235-00': 'Vectone',
  '234-02': 'O2', '234-11': 'O2',
  '234-07': 'Vodafone', '234-15': 'Vodafone', '235-91': 'Vodafone', '235-92': 'Vodafone',
  '234-30': 'T-Mobile UK', '234-31': 'T-Mobile UK', '234-32': 'T-Mobile UK',
  '234-33': 'EE', '234-34': 'EE', '234-86': 'EE', '235-01': 'EE', '235-02': 'EE',
  '234-03': 'Airtel', '234-10': 'Giffgaff', '234-20': '3UK', '234-25': 'Truphone', '234-26': 'Lycamobile', '234-38': 'Virgin Mobile',
  //菲律賓電信業者 Philippine
  '515-01': 'Islacom', '515-02': 'Globe', '515-03': 'Smart', '515-04': 'Sun', '515-08': 'Next Mobile', '515-18': 'Cure', '515-24': 'ABS-CBN',
  //越南電信業者 Vietnam
  '452-01': 'Mobifone', '452-02': 'Vinaphone', '452-03': 'S-Fone', '452-04': 'Viettel', '452-05': 'VietNamobile', '452-06': 'E-mobile', '452-07': 'Gmobile',
};

const radioGeneration = {
  'GPRS': '2.5G',
  'CDMA1x': '2.5G',
  'EDGE': '2.75G',
  'WCDMA': '3G',
  'HSDPA': '3.5G',
  'CDMAEVDORev0': '3.5G',
  'CDMAEVDORevA': '3.5G',
  'CDMAEVDORevB': '3.75G',
  'HSUPA': '3.75G',
  'eHRPD': '3.9G',
  'LTE': '4G',
  'NRNSA': '5G',
  'NR': '5G',
};

if (!v4.primaryAddress && !v6.primaryAddress) {
  $done({
    title: '沒有網路',
    content: '尚未連接網際網路\n請檢查網際網路狀態後重試',
    icon: 'wifi.exclamationmark',
    'icon-color': '#CB1B45',
  });
} else {
  if ($network['cellular-data']) {
    const carrierId = $network['cellular-data'].carrier;
    const radio = $network['cellular-data'].radio;
    if (carrierId && radio) {
      cellularInfo = carrierNames[carrierId] ?
        carrierNames[carrierId] + ' | ' + radioGeneration[radio] + ' - ' + radio :
        '行動數據 | ' + radioGeneration[radio] + ' - ' + radio;
    }
  }
  $httpClient.get('http://ip-api.com/json', function (error, response, data) {
    if (error) {
      $done({
        title: '發生錯誤',
        content: '無法獲得目前網路資訊\n請檢查網際網路狀態後重試',
        icon: 'wifi.exclamationmark',
        'icon-color': '#CB1B45',
      });
    }

    const info = JSON.parse(data);
    $done({
      title: wifi.ssid ? wifi.ssid : cellularInfo,
      content:
        (v4.primaryAddress ? `IPv4 : ${v4.primaryAddress} \n` : '') +
        (v6.primaryAddress ? `IPv6 : ${v6.primaryAddress}\n` : '') +
        (v4.primaryRouter && wifi.ssid ? `Router IPv4 : ${v4.primaryRouter}\n` : '') +
        (v6.primaryRouter && wifi.ssid ? `Router IPv6 : ${v6.primaryRouter}\n` : '') +
        `節點 IP : ${info.query}\n` +
        `節點 ISP : ${info.isp}\n` +
        `節點位置 : ${getFlagEmoji(info.countryCode)} | ${info.country} - ${info.city
        }`,
      icon: wifi.ssid ? 'wifi' : 'simcard',
      'icon-color': wifi.ssid ? '#005CAF' : '#F9BF45',
    });
  });
}

function getFlagEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}
