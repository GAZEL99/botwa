// === WhatsApp Bot Premium App and Social Media Services Handler ===

// Helper functions
function toIDR(amount) {
  return amount.toLocaleString('id-ID');
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize user data if not exists
function initUser(sender) {
  if (!db.users[sender]) {
    db.users[sender] = {
      status_deposit: false,
      saweria: null
    };
  }
}

// === PREMIUM APP HANDLER ===

// Level 1: Main App Selection
case "apkprem": {
  try {
    if (m.isGroup) return Reply("Pembelian aplikasi hanya bisa di dalam private chat");
    initUser(m.sender);
    
    if (db.users[m.sender]?.status_deposit) {
      return Reply("Masih ada transaksi yang belum diselesaikan, ketik *.batalbeli* untuk membatalkan transaksi sebelumnya!");
    }

    const listApp = {
      netflix: "Netflix",
      spotify: "Spotify",
      canva: "Canva",
      capcut: "Capcut",
      gpt: "ChatGPT",
      viu: "Viu",
      disney: "Disney+",
      get: "GetContact",
      iqiyi: "IQIYI",
      vision: "Vision+",
      wetv: "WETV",
      yt: "YouTube Premium",
      bst: "Bstation",
      crunchy: "Crunchyroll",
      wink: "Wink",
      alight: "Alight Motion"
    };

    const rows = Object.entries(listApp).map(([key, value]) => ({
      title: value,
      description: `Lihat paket ${value}`,
      id: `pilihapp ${key}`
    }));

    await tama.sendMessage(m.chat, {
      text: "🛍️ Pilih aplikasi premium yang ingin kamu beli:",
      footer: global.botname,
      buttons: [
        {
          buttonId: 'list_aplikasi',
          buttonText: { displayText: '📱 List Aplikasi Premium' },
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: '📦 Aplikasi Premium',
              sections: [
                {
                  title: 'Tersedia Sekarang',
                  rows: rows
                }
              ]
            })
          }
        }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

  } catch (error) {
    console.error("Error in apkprem handler:", error);
    return Reply("⚠️ Terjadi kesalahan saat menampilkan list aplikasi.");
  }
  break;
}

// Level 2: Package Selection
case "pilihapp": {
  try {
    let appKey = '';
    
    if (m.message?.listResponseMessage?.singleSelectReply?.selectedRowId) {
      appKey = m.message.listResponseMessage.singleSelectReply.selectedRowId.split(" ")[1];
    } else {
      appKey = m.body.split(" ")[1];
    }
    
    if (!appKey) return Reply("Silakan pilih aplikasi yang valid");

    const allPackages = {
      netflix: [
        { name: "Netflix Sharing 2 User (1 Profil)", price: 22000, code: "netflix_sharing2" },
        { name: "Netflix Sharing 1 User (1 Profil)", price: 30000, code: "netflix_sharing1" },
        { name: "Netflix Semi Private", price: 44000, code: "netflix_semipriv" }
      ],
      spotify: [
        { name: "Spotify Family 1 Bulan", price: 25000, code: "spotify_family1" },
        { name: "Spotify Family 2 Bulan", price: 30000, code: "spotify_family2" },
        { name: "Spotify Individu 1 Bulan", price: 28000, code: "spotify_ind1" },
        { name: "Spotify Individu 2 Bulan", price: 34000, code: "spotify_ind2" }
      ],
      canva: [
        { name: "Canva Premium 1 Bulan", price: 5000, code: "canva_1m" },
        { name: "Canva Premium 2 Minggu", price: 1500, code: "canva_2w" },
        { name: "Canva Premium 1 Tahun", price: 20000, code: "canva_1y" }
      ],
      capcut: [
        { name: "Capcut 1 Bulan (7 Hari Garansi)", price: 21000, code: "capcut_1w" },
        { name: "Capcut 1 Bulan (28 Hari Garansi)", price: 28000, code: "capcut_28d" }
      ],
      gpt: [
        { name: "ChatGPT 1 Bulan (7 Hari Garansi)", price: 21000, code: "gpt_1w" },
        { name: "ChatGPT 1 Bulan (28 Hari Garansi)", price: 30000, code: "gpt_28d" }
      ],
      viu: [
        { name: "Viu 1 Bulan", price: 5000, code: "viu_1m" },
        { name: "Viu 3 Bulan (1 Bulan Garansi)", price: 8000, code: "viu_3m" },
        { name: "Viu 3 Bulan (2 Bulan Garansi)", price: 10000, code: "viu_3m2" },
        { name: "Viu 6 Bulan (1 Bulan Garansi)", price: 13000, code: "viu_6m" }
      ],
      disney: [
        { name: "Disney+ Shared 5 User", price: 15000, code: "disney_share" },
        { name: "Disney+ Private (Nomor)", price: 40000, code: "disney_priv" }
      ],
      get: [
        { name: "GetContact 1 Bulan", price: 11500, code: "get_1m" }
      ],
      iqiyi: [
        { name: "IQIYI Shared 1 Bulan", price: 14000, code: "iqiyi_1m" },
        { name: "IQIYI Shared Max 2 Devices", price: 23000, code: "iqiyi_1m2" }
      ],
      vision: [
        { name: "Vision+ Premium 1 Bulan", price: 22500, code: "vision_1m" }
      ],
      wetv: [
        { name: "WeTV Shared", price: 12000, code: "wetv_share" },
        { name: "WeTV Private", price: 33000, code: "wetv_priv" }
      ],
      yt: [
        { name: "YouTube Premium Family Plan", price: 3500, code: "yt_fam" }
      ],
      bst: [
        { name: "Bstation Premium 1 Bulan Shared", price: 6000, code: "bst_1m" },
        { name: "Bstation Premium 3 Bulan Shared", price: 11000, code: "bst_3m" },
        { name: "Bstation Premium 1 Bulan Private", price: 23000, code: "bst_1m_priv" },
        { name: "Bstation Premium 2 Bulan Private", price: 39000, code: "bst_2m_priv" },
        { name: "Bstation Premium 1 Tahun Shared", price: 15000, code: "bst_1y_shared" }
      ],
      crunchy: [
        { name: "Crunchyroll 1 Bulan", price: 15000, code: "crunchy_1b" },
        { name: "Crunchyroll 1 Tahun", price: 29000, code: "crunchy_1y" }
      ],
      wink: [
        { name: "Wink Premium 2 Bulan", price: 30000, code: "wink_2m" }
      ],
      alight: [
        { name: "Alight Motion Sharing 1 Tahun", price: 3000, code: "alight_share" },
        { name: "Alight Motion Email Customer 1 Tahun", price: 5000, code: "alight_emailcust" },
        { name: "Alight Motion Email Seller 1 Tahun", price: 7000, code: "alight_emailseller" }
      ]
    };

    const packages = allPackages[appKey];
    if (!packages) return Reply("Aplikasi yang dipilih tidak valid");

    const rows = packages.map(pkg => ({
      title: `${pkg.name} - Rp${toIDR(pkg.price)}`,
      description: `Beli paket ini`,
      id: `buyapp ${pkg.code}`
    }));

    return tama.sendMessage(m.chat, {
      text: `Pilih paket yang ingin dibeli:`,
      footer: global.botname,
      buttons: [
        {
          buttonId: 'action',
          buttonText: { displayText: 'List Paket' },
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: `Paket Tersedia`,
              sections: [
                {
                  title: 'Pilihan Paket',
                  rows: rows
                }
              ]
            })
          }
        }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

  } catch (error) {
    console.error("Error in pilihapp handler:", error);
    return Reply("Terjadi kesalahan saat menampilkan paket.");
  }
  break;
}

// === SOCIAL MEDIA SERVICES HANDLER ===

// Level 1: Category Selection
case "sosmed": {
  try {
    if (m.isGroup) return Reply("Pemesanan layanan hanya bisa di dalam private chat");
    initUser(m.sender);
    
    if (db.users[m.sender]?.status_deposit) {
      return Reply("Masih ada transaksi yang belum diselesaikan, ketik *.batalbeli* untuk membatalkan transaksi sebelumnya!");
    }

    const categories = {
      tiktok: "TikTok Services",
      instagram: "Instagram Services",
      youtube: "YouTube Services",
      facebook: "Facebook Services"
    };

    const rows = Object.entries(categories).map(([key, value]) => ({
      title: `📱 ${value}`,
      description: `Lihat layanan ${value}`,
      id: `pilihkategori ${key}`
    }));

    await tama.sendMessage(m.chat, {
      text: "🌟 *PILIH KATEGORI LAYANAN SOSMED* 🌟\n\nPilih platform yang ingin Anda tingkatkan:",
      footer: global.botname,
      buttons: [
        {
          buttonId: 'list_kategori',
          buttonText: { displayText: '📊 List Kategori' },
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: '📲 Layanan Sosial Media',
              sections: [
                {
                  title: 'Platform Tersedia',
                  rows: rows
                }
              ]
            })
          }
        }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

  } catch (error) {
    console.error("Error in sosmed handler:", error);
    return Reply("⚠️ Terjadi kesalahan saat menampilkan kategori layanan.");
  }
  break;
}

// Level 2: Service Selection
case "pilihkategori": {
  try {
    let categoryKey = '';
    
    if (m.message?.listResponseMessage?.singleSelectReply?.selectedRowId) {
      categoryKey = m.message.listResponseMessage.singleSelectReply.selectedRowId.split(" ")[1];
    } else {
      categoryKey = m.body.split(" ")[1];
    }
    
    if (!categoryKey) return Reply("Silakan pilih kategori yang valid");

    const allServices = {
      tiktok: [
        { name: "TIKTOK FOLLOWER INDONESIA (30 DAY GARANSI)", code: "tt_follow_id" },
        { name: "TIKTOK FOLLOWER FAST (30 DAY GARANSI)", code: "tt_follow_fast" },
        { name: "Tiktok Follower slow (NO GARANSI)", code: "tt_follow_slow" },
        { name: "TIKTOK LIKE (GARANSI 7 HARI)", code: "tt_like" },
        { name: "VIEW TIKTOK (NO GARANSI)", code: "tt_view" },
        { name: "Tiktok Save (GARANSI 7 DAY)", code: "tt_save" },
        { name: "SHARE TIKTOK (GARANSI 7 DAY)", code: "tt_share" }
      ],
      instagram: [
        { name: "INSTAGRAM FOLLOWER FAST (30 DAY GARANSI)", code: "ig_follow_fast" },
        { name: "INSTAGRAM FOLLOWER INDONESIA (7 DAY GARANSI)", code: "ig_follow_id" },
        { name: "LIKE INSTAGRAM GLOBAL (15 DAY GARANSI)", code: "ig_like_global" },
        { name: "INSTAGRAM LIKE INDONESIA (7 DAY GARANSI)", code: "ig_like_id" },
        { name: "INSTAGRAM VIEW (NO GARANSI)", code: "ig_view" }
      ],
      youtube: [
        { name: "YOUTUBE SUBSCRIBER FAST (30 DAY GARANSI)", code: "yt_sub_fast" },
        { name: "YOUTUBE SUBSCRIBER SLOW (NO GARANSI)", code: "yt_sub_slow" },
        { name: "YOUTUBE LIKE (GARANSI 7 DAY)", code: "yt_like" },
        { name: "YOUTUBE VIEW (GARANSI 7 DAY)", code: "yt_view" }
      ],
      facebook: [
        { name: "FACEBOOK FOLLOWER FAST (NO GARANSI)", code: "fb_follow" },
        { name: "POST LIKE FACEBOOK (NO GARANSI)", code: "fb_like" }
      ]
    };

    const services = allServices[categoryKey];
    if (!services) return Reply("Kategori yang dipilih tidak valid");

    const rows = services.map(service => ({
      title: `✨ ${service.name}`,
      description: `Lihat pricelist ${service.name.split('(')[0]}`,
      id: `pilihlayanan ${service.code}`
    }));

    return tama.sendMessage(m.chat, {
      text: `📊 *LAYANAN ${categoryKey.toUpperCase()}* 📊\n\nPilih jenis layanan yang Anda butuhkan:`,
      footer: global.botname,
      buttons: [
        {
          buttonId: 'action',
          buttonText: { displayText: 'List Layanan' },
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: `Layanan ${categoryKey.toUpperCase()}`,
              sections: [
                {
                  title: 'Pilihan Layanan',
                  rows: rows
                }
              ]
            })
          }
        }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

  } catch (error) {
    console.error("Error in pilihkategori handler:", error);
    return Reply("Terjadi kesalahan saat menampilkan layanan.");
  }
  break;
}

// Level 3: Price List Selection
case "pilihlayanan": {
  try {
    let serviceCode = '';
    
    if (m.message?.listResponseMessage?.singleSelectReply?.selectedRowId) {
      serviceCode = m.message.listResponseMessage.singleSelectReply.selectedRowId.split(" ")[1];
    } else {
      serviceCode = m.body.split(" ")[1];
    }
    
    if (!serviceCode) return Reply("Silakan pilih layanan yang valid");

    const allPriceLists = {
      // TikTok Services
      tt_follow_id: [
        { name: "100 Follower", price: 10000, code: "tt_follow_id_100" },
        { name: "200 Follower", price: 20000, code: "tt_follow_id_200" },
        { name: "300 Follower", price: 30000, code: "tt_follow_id_300" },
        { name: "400 Follower", price: 40000, code: "tt_follow_id_400" },
        { name: "500 Follower", price: 50000, code: "tt_follow_id_500" },
        { name: "600 Follower", price: 60000, code: "tt_follow_id_600" },
        { name: "700 Follower", price: 70000, code: "tt_follow_id_700" },
        { name: "800 Follower", price: 80000, code: "tt_follow_id_800" },
        { name: "900 Follower", price: 90000, code: "tt_follow_id_900" },
        { name: "1000 Follower", price: 100000, code: "tt_follow_id_1000" }
      ],
      tt_follow_fast: [
        { name: "100 Follower", price: 5500, code: "tt_follow_fast_100" },
        { name: "200 Follower", price: 10000, code: "tt_follow_fast_200" },
        { name: "300 Follower", price: 14500, code: "tt_follow_fast_300" },
        { name: "400 Follower", price: 19000, code: "tt_follow_fast_400" },
        { name: "500 Follower", price: 23500, code: "tt_follow_fast_500" },
        { name: "600 Follower", price: 28000, code: "tt_follow_fast_600" },
        { name: "700 Follower", price: 32500, code: "tt_follow_fast_700" },
        { name: "800 Follower", price: 37000, code: "tt_follow_fast_800" },
        { name: "900 Follower", price: 41500, code: "tt_follow_fast_900" },
        { name: "1000 Follower", price: 46000, code: "tt_follow_fast_1000" }
      ],
      tt_follow_slow: [
        { name: "100 Follower", price: 3000, code: "tt_follow_slow_100" },
        { name: "200 Follower", price: 6000, code: "tt_follow_slow_200" },
        { name: "300 Follower", price: 8500, code: "tt_follow_slow_300" },
        { name: "400 Follower", price: 11500, code: "tt_follow_slow_400" },
        { name: "500 Follower", price: 14000, code: "tt_follow_slow_500" },
        { name: "600 Follower", price: 17000, code: "tt_follow_slow_600" },
        { name: "700 Follower", price: 20000, code: "tt_follow_slow_700" },
        { name: "800 Follower", price: 22500, code: "tt_follow_slow_800" },
        { name: "900 Follower", price: 25500, code: "tt_follow_slow_900" },
        { name: "1000 Follower", price: 28000, code: "tt_follow_slow_1000" }
      ],
      tt_like: [
        { name: "100 Like", price: 1000, code: "tt_like_100" },
        { name: "200 Like", price: 2000, code: "tt_like_200" },
        { name: "300 Like", price: 3000, code: "tt_like_300" },
        { name: "400 Like", price: 4000, code: "tt_like_400" },
        { name: "500 Like", price: 5000, code: "tt_like_500" },
        { name: "600 Like", price: 6000, code: "tt_like_600" },
        { name: "700 Like", price: 7000, code: "tt_like_700" },
        { name: "800 Like", price: 8000, code: "tt_like_800" },
        { name: "900 Like", price: 9000, code: "tt_like_900" },
        { name: "1000 Like", price: 7000, code: "tt_like_1000" },
        { name: "2000 Like", price: 13000, code: "tt_like_2000" },
        { name: "3000 Like", price: 14000, code: "tt_like_3000" },
        { name: "4000 Like", price: 14500, code: "tt_like_4000" },
        { name: "5000 Like", price: 15000, code: "tt_like_5000" },
        { name: "6000 Like", price: 18000, code: "tt_like_6000" },
        { name: "7000 Like", price: 20000, code: "tt_like_7000" },
        { name: "8000 Like", price: 22000, code: "tt_like_8000" },
        { name: "9000 Like", price: 24000, code: "tt_like_9000" },
        { name: "10.000 Like", price: 25000, code: "tt_like_10000" }
      ],
      tt_view: [
        { name: "10.000 View", price: 1000, code: "tt_view_10k" },
        { name: "20.000 View", price: 2000, code: "tt_view_20k" },
        { name: "30.000 View", price: 3000, code: "tt_view_30k" },
        { name: "40.000 View", price: 3500, code: "tt_view_40k" },
        { name: "50.000 View", price: 4000, code: "tt_view_50k" },
        { name: "60.000 View", price: 5000, code: "tt_view_60k" },
        { name: "70.000 View", price: 6000, code: "tt_view_70k" },
        { name: "80.000 View", price: 6500, code: "tt_view_80k" },
        { name: "90.000 View", price: 7000, code: "tt_view_90k" },
        { name: "100.000 View", price: 8000, code: "tt_view_100k" }
      ],
      tt_save: [
        { name: "100 Saves", price: 1000, code: "tt_save_100" },
        { name: "200 Saves", price: 1500, code: "tt_save_200" },
        { name: "300 Saves", price: 2000, code: "tt_save_300" },
        { name: "400 Saves", price: 2500, code: "tt_save_400" },
        { name: "500 Saves", price: 3000, code: "tt_save_500" },
        { name: "600 Saves", price: 3500, code: "tt_save_600" },
        { name: "700 Saves", price: 4000, code: "tt_save_700" },
        { name: "800 Saves", price: 4500, code: "tt_save_800" },
        { name: "900 Saves", price: 5000, code: "tt_save_900" },
        { name: "1000 Saves", price: 5500, code: "tt_save_1000" }
      ],
      tt_share: [
        { name: "100 Share", price: 1000, code: "tt_share_100" },
        { name: "200 Share", price: 1500, code: "tt_share_200" },
        { name: "300 Share", price: 2000, code: "tt_share_300" },
        { name: "400 Share", price: 2500, code: "tt_share_400" },
        { name: "500 Share", price: 3000, code: "tt_share_500" },
        { name: "600 Share", price: 3500, code: "tt_share_600" },
        { name: "700 Share", price: 4000, code: "tt_share_700" },
        { name: "800 Share", price: 4500, code: "tt_share_800" },
        { name: "900 Share", price: 5000, code: "tt_share_900" },
        { name: "1000 Share", price: 5500, code: "tt_share_1000" }
      ],
      // Instagram Services
      ig_follow_fast: [
        { name: "100 Followers", price: 4000, code: "ig_follow_fast_100" },
        { name: "200 Followers", price: 8000, code: "ig_follow_fast_200" },
        { name: "300 Followers", price: 12000, code: "ig_follow_fast_300" },
        { name: "400 Followers", price: 16000, code: "ig_follow_fast_400" },
        { name: "500 Followers", price: 20000, code: "ig_follow_fast_500" },
        { name: "600 Followers", price: 24000, code: "ig_follow_fast_600" },
        { name: "700 Followers", price: 28000, code: "ig_follow_fast_700" },
        { name: "800 Followers", price: 32000, code: "ig_follow_fast_800" },
        { name: "900 Followers", price: 36000, code: "ig_follow_fast_900" },
        { name: "1000 Followers", price: 40000, code: "ig_follow_fast_1000" }
      ],
      ig_follow_id: [
        { name: "100 Follower", price: 10000, code: "ig_follow_id_100" },
        { name: "200 Follower", price: 20000, code: "ig_follow_id_200" },
        { name: "300 Follower", price: 30000, code: "ig_follow_id_300" },
        { name: "400 Follower", price: 40000, code: "ig_follow_id_400" },
        { name: "500 Follower", price: 50000, code: "ig_follow_id_500" },
        { name: "600 Follower", price: 60000, code: "ig_follow_id_600" },
        { name: "700 Follower", price: 70000, code: "ig_follow_id_700" },
        { name: "800 Follower", price: 80000, code: "ig_follow_id_800" },
        { name: "900 Follower", price: 90000, code: "ig_follow_id_900" },
        { name: "1000 Follower", price: 100000, code: "ig_follow_id_1000" }
      ],
      ig_like_global: [
        { name: "100 Like", price: 1000, code: "ig_like_global_100" },
        { name: "200 Like", price: 1500, code: "ig_like_global_200" },
        { name: "300 Like", price: 2000, code: "ig_like_global_300" },
        { name: "400 Like", price: 2500, code: "ig_like_global_400" },
        { name: "500 Like", price: 3000, code: "ig_like_global_500" },
        { name: "600 Like", price: 3500, code: "ig_like_global_600" },
        { name: "700 Like", price: 4000, code: "ig_like_global_700" },
        { name: "800 Like", price: 4500, code: "ig_like_global_800" },
        { name: "900 Like", price: 5000, code: "ig_like_global_900" },
        { name: "1000 Like", price: 5500, code: "ig_like_global_1000" }
      ],
      ig_like_id: [
        { name: "100 Like", price: 3000, code: "ig_like_id_100" },
        { name: "200 Like", price: 5000, code: "ig_like_id_200" },
        { name: "300 Like", price: 7000, code: "ig_like_id_300" },
        { name: "400 Like", price: 9000, code: "ig_like_id_400" },
        { name: "500 Like", price: 11000, code: "ig_like_id_500" },
        { name: "600 Like", price: 13000, code: "ig_like_id_600" },
        { name: "700 Like", price: 15000, code: "ig_like_id_700" },
        { name: "800 Like", price: 17000, code: "ig_like_id_800" },
        { name: "900 Like", price: 19000, code: "ig_like_id_900" },
        { name: "1000 Like", price: 22000, code: "ig_like_id_1000" }
      ],
      ig_view: [
        { name: "10.000 View", price: 1000, code: "ig_view_10k" },
        { name: "20.000 View", price: 2000, code: "ig_view_20k" },
        { name: "30.000 View", price: 3000, code: "ig_view_30k" },
        { name: "40.000 View", price: 3500, code: "ig_view_40k" },
        { name: "50.000 View", price: 4000, code: "ig_view_50k" },
        { name: "60.000 View", price: 5000, code: "ig_view_60k" },
        { name: "70.000 View", price: 6000, code: "ig_view_70k" },
        { name: "80.000 View", price: 6500, code: "ig_view_80k" },
        { name: "90.000 View", price: 7000, code: "ig_view_90k" },
        { name: "100.000 View", price: 8000, code: "ig_view_100k" }
      ],
      // YouTube Services
      yt_sub_fast: [
        { name: "100 Subscriber", price: 15000, code: "yt_sub_fast_100" },
        { name: "200 Subscriber", price: 27000, code: "yt_sub_fast_200" },
        { name: "300 Subscriber", price: 39000, code: "yt_sub_fast_300" },
        { name: "400 Subscriber", price: 50000, code: "yt_sub_fast_400" },
        { name: "500 Subscriber", price: 60000, code: "yt_sub_fast_500" },
        { name: "600 Subscriber", price: 70000, code: "yt_sub_fast_600" },
        { name: "700 Subscriber", price: 78000, code: "yt_sub_fast_700" },
        { name: "800 Subscriber", price: 85000, code: "yt_sub_fast_800" },
        { name: "900 Subscriber", price: 93000, code: "yt_sub_fast_900" },
        { name: "1000 Subscriber", price: 100000, code: "yt_sub_fast_1000" }
      ],
      yt_sub_slow: [
        { name: "100 Subscriber", price: 5000, code: "yt_sub_slow_100" },
        { name: "200 Subscriber", price: 9000, code: "yt_sub_slow_200" },
        { name: "300 Subscriber", price: 13000, code: "yt_sub_slow_300" },
        { name: "400 Subscriber", price: 17000, code: "yt_sub_slow_400" },
        { name: "500 Subscriber", price: 20000, code: "yt_sub_slow_500" },
        { name: "600 Subscriber", price: 24000, code: "yt_sub_slow_600" },
        { name: "700 Subscriber", price: 28000, code: "yt_sub_slow_700" },
        { name: "800 Subscriber", price: 32000, code: "yt_sub_slow_800" },
        { name: "900 Subscriber", price: 36000, code: "yt_sub_slow_900" },
        { name: "1000 Subscriber", price: 40000, code: "yt_sub_slow_1000" }
      ],
      yt_like: [
        { name: "100 Like", price: 1000, code: "yt_like_100" },
        { name: "200 Like", price: 2000, code: "yt_like_200" },
        { name: "300 Like", price: 3000, code: "yt_like_300" },
        { name: "400 Like", price: 4000, code: "yt_like_400" },
        { name: "500 Like", price: 5000, code: "yt_like_500" },
        { name: "600 Like", price: 6000, code: "yt_like_600" },
        { name: "700 Like", price: 7000, code: "yt_like_700" },
        { name: "800 Like", price: 8000, code: "yt_like_800" },
        { name: "900 Like", price: 9000, code: "yt_like_900" },
        { name: "1000 Like", price: 10000, code: "yt_like_1000" }
      ],
      yt_view: [
        { name: "100 View", price: 3000, code: "yt_view_100" },
        { name: "200 View", price: 5000, code: "yt_view_200" },
        { name: "300 View", price: 7000, code: "yt_view_300" },
        { name: "400 View", price: 9000, code: "yt_view_400" },
        { name: "500 View", price: 11000, code: "yt_view_500" },
        { name: "600 View", price: 13000, code: "yt_view_600" },
        { name: "700 View", price: 15000, code: "yt_view_700" },
        { name: "800 View", price: 17000, code: "yt_view_800" },
        { name: "900 View", price: 19000, code: "yt_view_900" },
        { name: "1000 View", price: 22000, code: "yt_view_1000" }
      ],
      // Facebook Services
      fb_follow: [
        { name: "100 Follower", price: 2500, code: "fb_follow_100" },
        { name: "200 Follower", price: 4500, code: "fb_follow_200" },
        { name: "300 Follower", price: 6500, code: "fb_follow_300" },
        { name: "400 Follower", price: 8500, code: "fb_follow_400" },
        { name: "500 Follower", price: 11000, code: "fb_follow_500" },
        { name: "600 Follower", price: 13000, code: "fb_follow_600" },
        { name: "700 Follower", price: 15500, code: "fb_follow_700" },
        { name: "800 Follower", price: 17500, code: "fb_follow_800" },
        { name: "900 Follower", price: 20000, code: "fb_follow_900" },
        { name: "1000 Follower", price: 22000, code: "fb_follow_1000" }
      ],
      fb_like: [
        { name: "100 Like", price: 2000, code: "fb_like_100" },
        { name: "200 Like", price: 4000, code: "fb_like_200" },
        { name: "300 Like", price: 6000, code: "fb_like_300" },
        { name: "400 Like", price: 8000, code: "fb_like_400" },
        { name: "500 Like", price: 10000, code: "fb_like_500" },
        { name: "600 Like", price: 12000, code: "fb_like_600" },
        { name: "700 Like", price: 14000, code: "fb_like_700" },
        { name: "800 Like", price: 16000, code: "fb_like_800" },
        { name: "900 Like", price: 18000, code: "fb_like_900" },
        { name: "1000 Like", price: 20000, code: "fb_like_1000" }
      ]
    };

    const priceList = allPriceLists[serviceCode];
    if (!priceList) return Reply("Layanan tidak valid!");

    const rows = priceList.map(item => ({
      title: `${item.name} - Rp${toIDR(item.price)}`,
      description: `Beli paket ini`,
      id: `termsapp ${item.code}`
    }));

    const serviceName = Object.entries(allServices).reduce((acc, [cat, services]) => {
      const found = services.find(s => s.code === serviceCode);
      return found ? found.name : acc;
    }, "Layanan");

    return tama.sendMessage(m.chat, {
      text: `💰 *PRICELIST ${serviceName.toUpperCase()}* 💰\n\nBerikut daftar harga yang tersedia:`,
      footer: global.botname,
      buttons: [
        {
          buttonId: 'action',
          buttonText: { displayText: 'List Harga' },
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: `Harga ${serviceName}`,
              sections: [
                {
                  title: 'Pilihan Paket',
                  rows: rows
                }
              ]
            })
          }
        }
      ],
      headerType: 1,
      viewOnce: true
    }, { quoted: m });

  } catch (error) {
    console.error("Error in pilihlayanan handler:", error);
    return Reply("Terjadi kesalahan saat menampilkan harga.");
  }
  break;
}

// Level 4: Terms and Payment
case "termsapp": {
  try {
    let itemCode = '';
    
    if (m.message?.listResponseMessage?.singleSelectReply?.selectedRowId) {
      itemCode = m.message.listResponseMessage.singleSelectReply.selectedRowId.split(" ")[1];
    } else {
      itemCode = m.body.split(" ")[1];
    }
    
    if (!itemCode) return Reply("Silakan pilih paket yang valid");

    // Combine all price lists from both app and social media services
    const combinedPrices = {
      // App prices
      netflix_sharing2: ["Netflix Sharing 2 User (1 Profil)", 22000],
      netflix_sharing1: ["Netflix Sharing 1 User (1 Profil)", 30000],
      netflix_semipriv: ["Netflix Semi Private", 44000],
      spotify_family1: ["Spotify Family 1 Bulan", 25000],
      spotify_family2: ["Spotify Family 2 Bulan", 30000],
      spotify_ind1: ["Spotify Individu 1 Bulan", 28000],
      spotify_ind2: ["Spotify Individu 2 Bulan", 34000],
      canva_1m: ["Canva Premium 1 Bulan", 5000],
      canva_2w: ["Canva Premium 2 Minggu", 1500],
      canva_1y: ["Canva Premium 1 Tahun", 20000],
      capcut_1w: ["Capcut 1 Bulan (7 Hari Garansi)", 21000],
      capcut_28d: ["Capcut 1 Bulan (28 Hari Garansi)", 28000],
      gpt_1w: ["ChatGPT 1 Bulan (7 Hari Garansi)", 21000],
      gpt_28d: ["ChatGPT 1 Bulan (28 Hari Garansi)", 30000],
      viu_1m: ["Viu 1 Bulan", 5000],
      viu_3m: ["Viu 3 Bulan (1 Bulan Garansi)", 8000],
      viu_3m2: ["Viu 3 Bulan (2 Bulan Garansi)", 10000],
      viu_6m: ["Viu 6 Bulan (1 Bulan Garansi)", 13000],
      disney_share: ["Disney+ Shared 5 User", 15000],
      disney_priv: ["Disney+ Private (Nomor)", 40000],
      get_1m: ["GetContact 1 Bulan", 11500],
      iqiyi_1m: ["IQIYI Shared 1 Bulan", 14000],
      iqiyi_1m2: ["IQIYI Shared Max 2 Devices", 23000],
      vision_1m: ["Vision+ Premium 1 Bulan", 22500],
      wetv_share: ["WeTV Shared", 12000],
      wetv_priv: ["WeTV Private", 33000],
      yt_fam: ["YouTube Premium Family Plan", 3500],
      bst_1m: ["Bstation Premium 1 Bulan Shared", 6000],
      bst_3m: ["Bstation Premium 3 Bulan Shared", 11000],
      bst_1m_priv: ["Bstation Premium 1 Bulan Private", 23000],
      bst_2m_priv: ["Bstation Premium 2 Bulan Private", 39000],
      bst_1y_shared: ["Bstation Premium 1 Tahun Shared", 15000],
      crunchy_1b: ["Crunchyroll 1 Bulan", 15000],
      crunchy_1y: ["Crunchyroll 1 Tahun", 29000],
      wink_2m: ["Wink Premium 2 Bulan", 30000],
      alight_share: ["Alight Motion Sharing 1 Tahun", 3000],
      alight_emailcust: ["Alight Motion Email Customer 1 Tahun", 5000],
      alight_emailseller: ["Alight Motion Email Seller 1 Tahun", 7000],
      
      // Social media prices
      tt_follow_id_100: ["TIKTOK FOLLOWER INDONESIA 100", 10000],
      tt_follow_id_200: ["TIKTOK FOLLOWER INDONESIA 200", 20000],
      tt_follow_id_300: ["TIKTOK FOLLOWER INDONESIA 300", 30000],
      tt_follow_id_400: ["TIKTOK FOLLOWER INDONESIA 400", 40000],
      tt_follow_id_500: ["TIKTOK FOLLOWER INDONESIA 500", 50000],
      tt_follow_id_600: ["TIKTOK FOLLOWER INDONESIA 600", 60000],
      tt_follow_id_700: ["TIKTOK FOLLOWER INDONESIA 700", 70000],
      tt_follow_id_800: ["TIKTOK FOLLOWER INDONESIA 800", 80000],
      tt_follow_id_900: ["TIKTOK FOLLOWER INDONESIA 900", 90000],
      tt_follow_id_1000: ["TIKTOK FOLLOWER INDONESIA 1000", 100000],
      tt_follow_fast_100: ["TIKTOK FOLLOWER FAST 100", 5500],
      tt_follow_fast_200: ["TIKTOK FOLLOWER FAST 200", 10000],
      tt_follow_fast_300: ["TIKTOK FOLLOWER FAST 300", 14500],
      tt_follow_fast_400: ["TIKTOK FOLLOWER FAST 400", 19000],
      tt_follow_fast_500: ["TIKTOK FOLLOWER FAST 500", 23500],
      tt_follow_fast_600: ["TIKTOK FOLLOWER FAST 600", 28000],
      tt_follow_fast_700: ["TIKTOK FOLLOWER FAST 700", 32500],
      tt_follow_fast_800: ["TIKTOK FOLLOWER FAST 800", 37000],
      tt_follow_fast_900: ["TIKTOK FOLLOWER FAST 900", 41500],
      tt_follow_fast_1000: ["TIKTOK FOLLOWER FAST 1000", 46000],
      tt_follow_slow_100: ["TIKTOK FOLLOWER SLOW 100", 3000],
      tt_follow_slow_200: ["TIKTOK FOLLOWER SLOW 200", 6000],
      tt_follow_slow_300: ["TIKTOK FOLLOWER SLOW 300", 8500],
      tt_follow_slow_400: ["TIKTOK FOLLOWER SLOW 400", 11500],
      tt_follow_slow_500: ["TIKTOK FOLLOWER SLOW 500", 14000],
      tt_follow_slow_600: ["TIKTOK FOLLOWER SLOW 600", 17000],
      tt_follow_slow_700: ["TIKTOK FOLLOWER SLOW 700", 20000],
      tt_follow_slow_800: ["TIKTOK FOLLOWER SLOW 800", 22500],
      tt_follow_slow_900: ["TIKTOK FOLLOWER SLOW 900", 25500],
      tt_follow_slow_1000: ["TIKTOK FOLLOWER SLOW 1000", 28000],
      tt_like_100: ["TIKTOK LIKE 100", 1000],
      tt_like_200: ["TIKTOK LIKE 200", 2000],
      tt_like_300: ["TIKTOK LIKE 300", 3000],
      tt_like_400: ["TIKTOK LIKE 400", 4000],
      tt_like_500: ["TIKTOK LIKE 500", 5000],
      tt_like_600: ["TIKTOK LIKE 600", 6000],
      tt_like_700: ["TIKTOK LIKE 700", 7000],
      tt_like_800: ["TIKTOK LIKE 800", 8000],
      tt_like_900: ["TIKTOK LIKE 900", 9000],
      tt_like_1000: ["TIKTOK LIKE 1000", 7000],
      tt_like_2000: ["TIKTOK LIKE 2000", 13000],
      tt_like_3000: ["TIKTOK LIKE 3000", 14000],
      tt_like_4000: ["TIKTOK LIKE 4000", 14500],
      tt_like_5000: ["TIKTOK LIKE 5000", 15000],
      tt_like_6000: ["TIKTOK LIKE 6000", 18000],
      tt_like_7000: ["TIKTOK LIKE 7000", 20000],
      tt_like_8000: ["TIKTOK LIKE 8000", 22000],
      tt_like_9000: ["TIKTOK LIKE 9000", 24000],
      tt_like_10000: ["TIKTOK LIKE 10000", 25000],
      tt_view_10k: ["TIKTOK VIEW 10K", 1000],
      tt_view_20k: ["TIKTOK VIEW 20K", 2000],
      tt_view_30k: ["TIKTOK VIEW 30K", 3000],
      tt_view_40k: ["TIKTOK VIEW 40K", 3500],
      tt_view_50k: ["TIKTOK VIEW 50K", 4000],
      tt_view_60k: ["TIKTOK VIEW 60K", 5000],
      tt_view_70k: ["TIKTOK VIEW 70K", 6000],
      tt_view_80k: ["TIKTOK VIEW 80K", 6500],
      tt_view_90k: ["TIKTOK VIEW 90K", 7000],
      tt_view_100k: ["TIKTOK VIEW 100K", 8000],
      tt_save_100: ["TIKTOK SAVE 100", 1000],
      tt_save_200: ["TIKTOK SAVE 200", 1500],
      tt_save_300: ["TIKTOK SAVE 300", 2000],
      tt_save_400: ["TIKTOK SAVE 400", 2500],
      tt_save_500: ["TIKTOK SAVE 500", 3000],
      tt_save_600: ["TIKTOK SAVE 600", 3500],
      tt_save_700: ["TIKTOK SAVE 700", 4000],
      tt_save_800: ["TIKTOK SAVE 800", 4500],
      tt_save_900: ["TIKTOK SAVE 900", 5000],
      tt_save_1000: ["TIKTOK SAVE 1000", 5500],
      tt_share_100: ["TIKTOK SHARE 100", 1000],
      tt_share_200: ["TIKTOK SHARE 200", 1500],
      tt_share_300: ["TIKTOK SHARE 300", 2000],
      tt_share_400: ["TIKTOK SHARE 400", 2500],
      tt_share_500: ["TIKTOK SHARE 500", 3000],
      tt_share_600: ["TIKTOK SHARE 600", 3500],
      tt_share_700: ["TIKTOK SHARE 700", 4000],
      tt_share_800: ["TIKTOK SHARE 800", 4500],
      tt_share_900: ["TIKTOK SHARE 900", 5000],
      tt_share_1000: ["TIKTOK SHARE 1000", 5500],
      ig_follow_fast_100: ["INSTAGRAM FOLLOWER FAST 100", 4000],
      ig_follow_fast_200: ["INSTAGRAM FOLLOWER FAST 200", 8000],
      ig_follow_fast_300: ["INSTAGRAM FOLLOWER FAST 300", 12000],
      ig_follow_fast_400: ["INSTAGRAM FOLLOWER FAST 400", 16000],
      ig_follow_fast_500: ["INSTAGRAM FOLLOWER FAST 500", 20000],
      ig_follow_fast_600: ["INSTAGRAM FOLLOWER FAST 600", 24000],
      ig_follow_fast_700: ["INSTAGRAM FOLLOWER FAST 700", 28000],
      ig_follow_fast_800: ["INSTAGRAM FOLLOWER FAST 800", 32000],
      ig_follow_fast_900: ["INSTAGRAM FOLLOWER FAST 900", 36000],
      ig_follow_fast_1000: ["INSTAGRAM FOLLOWER FAST 1000", 40000],
      ig_follow_id_100: ["INSTAGRAM FOLLOWER INDONESIA 100", 10000],
      ig_follow_id_200: ["INSTAGRAM FOLLOWER INDONESIA 200", 20000],
      ig_follow_id_300: ["INSTAGRAM FOLLOWER INDONESIA 300", 30000],
      ig_follow_id_400: ["INSTAGRAM FOLLOWER INDONESIA 400", 40000],
      ig_follow_id_500: ["INSTAGRAM FOLLOWER INDONESIA 500", 50000],
      ig_follow_id_600: ["INSTAGRAM FOLLOWER INDONESIA 600", 60000],
      ig_follow_id_700: ["INSTAGRAM FOLLOWER INDONESIA 700", 70000],
      ig_follow_id_800: ["INSTAGRAM FOLLOWER INDONESIA 800", 80000],
      ig_follow_id_900: ["INSTAGRAM FOLLOWER INDONESIA 900", 90000],
      ig_follow_id_1000: ["INSTAGRAM FOLLOWER INDONESIA 1000", 100000],
      ig_like_global_100: ["INSTAGRAM LIKE GLOBAL 100", 1000],
      ig_like_global_200: ["INSTAGRAM LIKE GLOBAL 200", 1500],
      ig_like_global_300: ["INSTAGRAM LIKE GLOBAL 300", 2000],
      ig_like_global_400: ["INSTAGRAM LIKE GLOBAL 400", 2500],
      ig_like_global_500: ["INSTAGRAM LIKE GLOBAL 500", 3000],
      ig_like_global_600: ["INSTAGRAM LIKE GLOBAL 600", 3500],
      ig_like_global_700: ["INSTAGRAM LIKE GLOBAL 700", 4000],
      ig_like_global_800: ["INSTAGRAM LIKE GLOBAL 800", 4500],
      ig_like_global_900: ["INSTAGRAM LIKE GLOBAL 900", 5000],
      ig_like_global_1000: ["INSTAGRAM LIKE GLOBAL 1000", 5500],
      ig_like_id_100: ["INSTAGRAM LIKE INDONESIA 100", 3000],
      ig_like_id_200: ["INSTAGRAM LIKE INDONESIA 200", 5000],
      ig_like_id_300: ["INSTAGRAM LIKE INDONESIA 300", 7000],
      ig_like_id_400: ["INSTAGRAM LIKE INDONESIA 400", 9000],
      ig_like_id_500: ["INSTAGRAM LIKE INDONESIA 500", 11000],
      ig_like_id_600: ["INSTAGRAM LIKE INDONESIA 600", 13000],
      ig_like_id_700: ["INSTAGRAM LIKE INDONESIA 700", 15000],
      ig_like_id_800: ["INSTAGRAM LIKE INDONESIA 800", 17000],
      ig_like_id_900: ["INSTAGRAM LIKE INDONESIA 900", 19000],
      ig_like_id_1000: ["INSTAGRAM LIKE INDONESIA 1000", 22000],
      ig_view_10k: ["INSTAGRAM VIEW 10K", 1000],
      ig_view_20k: ["INSTAGRAM VIEW 20K", 2000],
      ig_view_30k: ["INSTAGRAM VIEW 30K", 3000],
      ig_view_40k: ["INSTAGRAM VIEW 40K", 3500],
      ig_view_50k: ["INSTAGRAM VIEW 50K", 4000],
      ig_view_60k: ["INSTAGRAM VIEW 60K", 5000],
      ig_view_70k: ["INSTAGRAM VIEW 70K", 6000],
      ig_view_80k: ["INSTAGRAM VIEW 80K", 6500],
      ig_view_90k: ["INSTAGRAM VIEW 90K", 7000],
      ig_view_100k: ["INSTAGRAM VIEW 100K", 8000],
      yt_sub_fast_100: ["YOUTUBE SUBSCRIBER FAST 100", 15000],
      yt_sub_fast_200: ["YOUTUBE SUBSCRIBER FAST 200", 27000],
      yt_sub_fast_300: ["YOUTUBE SUBSCRIBER FAST 300", 39000],
      yt_sub_fast_400: ["YOUTUBE SUBSCRIBER FAST 400", 50000],
      yt_sub_fast_500: ["YOUTUBE SUBSCRIBER FAST 500", 60000],
      yt_sub_fast_600: ["YOUTUBE SUBSCRIBER FAST 600", 70000],
      yt_sub_fast_700: ["YOUTUBE SUBSCRIBER FAST 700", 78000],
      yt_sub_fast_800: ["YOUTUBE SUBSCRIBER FAST 800", 85000],
      yt_sub_fast_900: ["YOUTUBE SUBSCRIBER FAST 900", 93000],
      yt_sub_fast_1000: ["YOUTUBE SUBSCRIBER FAST 1000", 100000],
      yt_sub_slow_100: ["YOUTUBE SUBSCRIBER SLOW 100", 5000],
      yt_sub_slow_200: ["YOUTUBE SUBSCRIBER SLOW 200", 9000],
      yt_sub_slow_300: ["YOUTUBE SUBSCRIBER SLOW 300", 13000],
      yt_sub_slow_400: ["YOUTUBE SUBSCRIBER SLOW 400", 17000],
      yt_sub_slow_500: ["YOUTUBE SUBSCRIBER SLOW 500", 20000],
      yt_sub_slow_600: ["YOUTUBE SUBSCRIBER SLOW 600", 24000],
      yt_sub_slow_700: ["YOUTUBE SUBSCRIBER SLOW 700", 28000],
      yt_sub_slow_800: ["YOUTUBE SUBSCRIBER SLOW 800", 32000],
      yt_sub_slow_900: ["YOUTUBE SUBSCRIBER SLOW 900", 36000],
      yt_sub_slow_1000: ["YOUTUBE SUBSCRIBER SLOW 1000", 40000],
      yt_like_100: ["YOUTUBE LIKE 100", 1000],
      yt_like_200: ["YOUTUBE LIKE 200", 2000],
      yt_like_300: ["YOUTUBE LIKE 300", 3000],
      yt_like_400: ["YOUTUBE LIKE 400", 4000],
      yt_like_500: ["YOUTUBE LIKE 500", 5000],
      yt_like_600: ["YOUTUBE LIKE 600", 6000],
      yt_like_700: ["YOUTUBE LIKE 700", 7000],
      yt_like_800: ["YOUTUBE LIKE 800", 8000],
      yt_like_900: ["YOUTUBE LIKE 900", 9000],
      yt_like_1000: ["YOUTUBE LIKE 1000", 10000],
      yt_view_100: ["YOUTUBE VIEW 100", 3000],
      yt_view_200: ["YOUTUBE VIEW 200", 5000],
      yt_view_300: ["YOUTUBE VIEW 300", 7000],
      yt_view_400: ["YOUTUBE VIEW 400", 9000],
      yt_view_500: ["YOUTUBE VIEW 500", 11000],
      yt_view_600: ["YOUTUBE VIEW 600", 13000],
      yt_view_700: ["YOUTUBE VIEW 700", 15000],
      yt_view_800: ["YOUTUBE VIEW 800", 17000],
      yt_view_900: ["YOUTUBE VIEW 900", 19000],
      yt_view_1000: ["YOUTUBE VIEW 1000", 22000],
      fb_follow_100: ["FACEBOOK FOLLOWER 100", 2500],
      fb_follow_200: ["FACEBOOK FOLLOWER 200", 4500],
      fb_follow_300: ["FACEBOOK FOLLOWER 300", 6500],
      fb_follow_400: ["FACEBOOK FOLLOWER 400", 8500],
      fb_follow_500: ["FACEBOOK FOLLOWER 500", 11000],
      fb_follow_600: ["FACEBOOK FOLLOWER 600", 13000],
      fb_follow_700: ["FACEBOOK FOLLOWER 700", 15500],
      fb_follow_800: ["FACEBOOK FOLLOWER 800", 17500],
      fb_follow_900: ["FACEBOOK FOLLOWER 900", 20000],
      fb_follow_1000: ["FACEBOOK FOLLOWER 1000", 22000],
      fb_like_100: ["FACEBOOK LIKE 100", 2000],
      fb_like_200: ["FACEBOOK LIKE 200", 4000],
      fb_like_300: ["FACEBOOK LIKE 300", 6000],
      fb_like_400: ["FACEBOOK LIKE 400", 8000],
      fb_like_500: ["FACEBOOK LIKE 500", 10000],
      fb_like_600: ["FACEBOOK LIKE 600", 12000],
      fb_like_700: ["FACEBOOK LIKE 700", 14000],
      fb_like_800: ["FACEBOOK LIKE 800", 16000],
      fb_like_900: ["FACEBOOK LIKE 900", 18000],
      fb_like_1000: ["FACEBOOK LIKE 1000", 20000]
    };

    if (!combinedPrices[itemCode]) return Reply("Paket tidak valid!");

    const product = {
      nama: combinedPrices[itemCode][0],
      harga: combinedPrices[itemCode][1]
    };

    const amount = product.harga + generateRandomNumber(110, 250);
    
    const paymentMessage = `
*🛒 PEMBAYARAN ${product.nama.toUpperCase()}*
📦 Produk: ${product.nama}
💰 Total: Rp${toIDR(amount)}
🕐 Expired: 5 Menit

*Note:* 
- Silahkan melakukan pembayaran sesuai harga produk
- Pilih metode pembayaran di bawah. Bot otomatis membaca pembayaran QRIS.
- Ketik *.batalbeli* untuk membatalkan transaksi.`;

    const msgQr = await tama.sendMessage(m.chat, {
      footer: global.botname,
      buttons: [
        {
          buttonId: 'action',
          buttonText: { displayText: 'Pilih Payment' },
          type: 4,
          nativeFlowInfo: {
            name: 'single_select',
            paramsJson: JSON.stringify({
              title: 'Pilih Payment Lain',
              sections: [
                {
                  title: 'List Payment',
                  rows: [
                    {
                      title: 'DANA',
                      id: 'dana'
                    },
                    {
                      title: 'BANK JAGO',
                      id: 'jago'
                    },
                    {
                      title: 'GOPAY',
                      id: 'gopay'
                    },
                    {
                      title: 'SHOPEEPAY',
                      id: 'shopeepay'
                    }
                  ]
                }
              ]
            })
          }
        }
      ],
      headerType: 1,
      viewOnce: true,
      image: {url: global.image.qris},
      caption: paymentMessage
    }, { quoted: m });

    initUser(m.sender);
    db.users[m.sender].status_deposit = true;
    
    db.users[m.sender].saweria = {
      msg: msgQr,
      chat: m.sender,
      amount: amount.toString(),
      produk: product.nama,
      packageCode: itemCode,
      paymentTimeout: setTimeout(async () => {
        if (db.users[m.sender]?.status_deposit) {
          try {
            await tama.sendMessage(m.sender, { text: "⚠️ Pembayaran Expired!" }, { quoted: msgQr });
            await tama.sendMessage(m.sender, { delete: msgQr.key });
          } catch (error) {
            console.error("Failed to send expired message:", error);
          }
          db.users[m.sender].status_deposit = false;
          delete db.users[m.sender].saweria;
        }
      }, 300000) // 5 minutes in milliseconds
    };

  } catch (error) {
    console.error("Error in termsapp handler:", error);
    Reply("Terjadi kesalahan dalam memproses permintaan. Silakan coba lagi.");
  }
  break;
}

// === PAYMENT METHOD HANDLERS ===

case "dana": {
  initUser(m.sender);
  if (!db.users[m.sender]?.status_deposit) return Reply("Tidak ada transaksi aktif.");
  
  let teks = `
PAYMENT DANA ${global.namaOwner.toUpperCase()}

Nomor : ${global.dana}

📦 Produk: ${db.users[m.sender].saweria.produk}
💰 Total: Rp${toIDR(db.users[m.sender].saweria.amount)}

[ ! ] Penting : 
1. Wajib kirimkan bukti transfer
2. Transfer tepat sesuai nominal
3. Pesanan diproses setelah pembayaran diverifikasi
`;
  await tama.sendMessage(m.chat, {text: teks}, {quoted: db.users[m.sender].saweria.msg});
  break;
}

case "jago": {
  initUser(m.sender);
  if (!db.users[m.sender]?.status_deposit) return Reply("Tidak ada transaksi aktif.");
  
  let teks = `
PAYMENT BANK JAGO ${global.namaOwner.toUpperCase()}

Nomor : ${global.ovo}
A/N : ${global.namaOwner}

📦 Produk: ${db.users[m.sender].saweria.produk}
💰 Total: Rp${toIDR(db.users[m.sender].saweria.amount)}

[ ! ] Penting : 
1. Wajib kirimkan bukti transfer
2. Transfer tepat sesuai nominal
3. Pesanan diproses setelah pembayaran diverifikasi
`;
  await tama.sendMessage(m.chat, {text: teks}, {quoted: db.users[m.sender].saweria.msg});
  break;
}

case "gopay": {
  initUser(m.sender);
  if (!db.users[m.sender]?.status_deposit) return Reply("Tidak ada transaksi aktif.");
  
  let teks = `
PAYMENT GOPAY ${global.namaOwner.toUpperCase()}

Nomor : ${global.gopay}

📦 Produk: ${db.users[m.sender].saweria.produk}
💰 Total: Rp${toIDR(db.users[m.sender].saweria.amount)}

[ ! ] Penting : 
1. Wajib kirimkan bukti transfer
2. Transfer tepat sesuai nominal
3. Pesanan diproses setelah pembayaran diverifikasi
`;
  await tama.sendMessage(m.chat, {text: teks}, {quoted: db.users[m.sender].saweria.msg});
  break;
}

case "shopeepay": {
  initUser(m.sender);
  if (!db.users[m.sender]?.status_deposit) return Reply("Tidak ada transaksi aktif.");
  
  let teks = `
PAYMENT SHOPEEPAY ${global.namaOwner.toUpperCase()}

Nomor : ${global.shopeepay}

📦 Produk: ${db.users[m.sender].saweria.produk}
💰 Total: Rp${toIDR(db.users[m.sender].saweria.amount)}

[ ! ] Penting : 
1. Wajib kirimkan bukti transfer
2. Transfer tepat sesuai nominal
3. Pesanan diproses setelah pembayaran diverifikasi
`;
  await tama.sendMessage(m.chat, {text: teks}, {quoted: db.users[m.sender].saweria.msg});
  break;
}

// === TRANSACTION MANAGEMENT ===

case "batalbeli": {
  try {
    initUser(m.sender);
    if (db.users[m.sender]?.status_deposit) {
      if (db.users[m.sender].saweria?.paymentTimeout) {
        clearTimeout(db.users[m.sender].saweria.paymentTimeout);
      }
      try {
        await tama.sendMessage(m.sender, { delete: db.users[m.sender].saweria?.msg.key });
      } catch (deleteError) {
        console.error("Failed to delete message:", deleteError);
      }
      db.users[m.sender].status_deposit = false;
      delete db.users[m.sender].saweria;
      return Reply("Transaksi berhasil dibatalkan.");
    } else {
      return Reply("Tidak ada transaksi aktif yang bisa dibatalkan.");
    }
  } catch (error) {
    console.error("Error in batalbeli handler:", error);
    return Reply("Gagal membatalkan transaksi.");
  }
  break;
}