export const channels = {
  nbaph: {
    name: "NBA TV PH",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cgnl_nba/default/index.mpd",
    keyId: "d1f8a0c97b3d4e529a6f2c4b8d7e1f90",
    key: "58ab331d14b66bf31aca4284e0a3e536",
    logo: "https://pngset.com/images/nba-tv-philippines-nba-tv-philippines-cignal-person-text-label-logo-transparent-png-2509143.png",
    group: ["sports", "entertainment"],
  },
 
    tv5: {
    name: "TV 5 HD",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/tv5_hd/default1/index.mpd",
    keyId: "2615129ef2c846a9bbd43a641c7303ef",
    key: "07c7f996b1734ea288641a68e1cfdc4d",
    logo: "https://vignette.wikia.nocookie.net/russel/images/f/f9/TV5_Logo_2011.png",
    group: ["news", "entertainment"],
  },

  GMA: {
    name: "GMA 7",
    type: "hls",
    manifestUri: "https://gsattv.akamaized.net/live/media0/gma7/Fairplay/gma7.m3u8",
    key: "https://key.nathcreqtives.com/widevine/?deviceId=02:00:00:00:00:00",
    logo: "https://ottepg8.comclark.com:8443/iptvepg/images/markurl/mark_1723126306082.png",
    group: ["news", "entertainment"],
  },

  Kapamilya: {
    name: "Kapamilya Channel HD",
    type: "clearkey",
    manifestUri: "https://d1uf7s78uqso1e.cloudfront.net/out/v1/efa01372657648be830e7c23ff68bea2/index.mpd",
    keyId: "bd17afb5dc9648a39be79ee3634dd4b8",
    key: "3ecf305d54a7729299b93a3d69c02ea5",
    logo: "https://cms.cignal.tv/Upload/Images/Kapamilya  Channel Logo alpha.png",
    group: ["news", "entertainment"],
  },
  
  dreamworks_tagalized: {
    name: "DreamWorks (Tagalized)",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_dreamworktag/default/index.mpd",
    keyId: "564b3b1c781043c19242c66e348699c5",
    key: "d3ad27d7fe1f14fb1a2cd5688549fbab",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDPoIb5G0splDYh5wCQY_vWyooZSSjfalhaQ&s",
    group: ["cartoons & animations"],
  },

   tvnpinoy: {
    name: "TVN Movies Pinoy",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-bpk-02-prod.akamaized.net/bpk-tv/cg_tvnmovie/default/index.mpd",
    keyId: "2e53f8d8a5e94bca8f9a1e16ce67df33",
    key: "3471b2464b5c7b033a03bb8307d9fa35",
    logo: "https://stmify.com/wp-content/uploads/2024/12/418-s.webp",
    group: ["movies"],
  },

   tmc: {
    name: "TMC",
    type: "clearkey",
    manifestUri: "https://qp-pldt-live-bpk-01-prod.akamaized.net/bpk-tv/cg_tagalogmovie/default/index.mpd",
    keyId: "96701d297d1241e492d41c397631d857",
    key: "ca2931211c1a261f082a3a2c4fd9f91b",
    logo: "https://upload.wikimedia.org/wikipedia/en/2/27/Tmc2021logo.png",
    group: ["movies"],
  },
  
};

// ==========================================
// ANIME SERIES DATA
// ==========================================

export const animeData = {
    "One Punch Man": [
        { 
            name: "Episode 1", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1FEVkSBw1g5gwz4YimKTuBWfs5kFW0nUq", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 2", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1FSJH9-ttzymb41gX4RgMdA91ybE46eeo", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 3", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1FZSG0tsRdQFwDlexnqCTAPXIn44Zdyl5", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 4", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1Fg-eY4_364iqKHV-Pr0dJELuLml0Nw5N", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 5", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1FfAJd-wNkvL7du6_U-HL3YDmKRBONdky", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 6", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1FqhQ0ei8O94p1S89waufyLcHSHrOOsaE", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 7", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1FgY6TIJGFbDYjtT-aUI4vXHeOeY2Qn26", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 8", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1Fy-CVAKzIwyNG3pkCsn97eB0wIEdeWI4", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 9", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1FwuIRL_c_syiAQN5RMZv2mr_NmKeVVmn", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 10", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1GBVyvg5ojhsLW6W1RR1KVH_lwS9JNwNf", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 11", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1G7zZkdzJKrh0PSejaxrmgkDMyI_WSjbH", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        },
        { 
            name: "Episode 12", 
            type: "mp4", 
            manifestUri: "https://series.shakzz.workers.dev/?id=1GEi51c0Oo6zkshEa1E1pagK591QbHMCW", 
            logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi0ERYHfvI8s0UnX2n1TZCEVZMxwTCMJcLF9IAolKFsNvjtptVCzaN4TFK&s=10" 
        }
    ],
    "My Hero Academia": [
        // Season 1
        { name: "Season 1 Ep 1", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=12rBQ2zQw4tSi2Fmii2lzRamR4233ads3", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 2", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1uA5SGVEXleO6figHixpepeASmsjyK2EF", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 3", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1Xzaxvi6HwoNkSewmNODjtD4DZrV133aM", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 4", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1GRiv8evXv8UvKjOmREk13VsfHNJcbxdF", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 5", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1sL1O49ApSGlFW0ItsPp-gl73rJk3V6Kr", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 6", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1cFnDAyzvJ4tiOIDKX3b9HdOSjF1GoaXU", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 7", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1TZMDCyMpAQemFsPJUo6t-wGygIS1t09S", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 8", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=10x_AW2JNAYlZvmuzXCNUMKxqWazvkm4o", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 9", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1DbsJ9oUcHUc2jjUriSeUPpSbaKVxuebv", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 10", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1flzuItH54yXvNAz4jtlKgBaqGCa5cDvS", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 11", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=198rke-rZRDYJAZsYGuY0aarRD3velu4y", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 12", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1kYRp-hj6UObK3cjM_JZffAB02FelYzvF", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 1 Ep 13", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1ZOmLpVNfEOGPTeKSe-KV_bVho_LfZg0C", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        // Season 2
        { name: "Season 2 Ep 1", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1wr73k7xxIe_7OSux5OZLV6dbkkwv9-1t", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 2", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1w9PHA2QNyeeGoTammtsOGsyERoRq3qKp", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 3", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1dNriqawpGCebW9XOXO7-HeiCtcWtvIlH", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 4", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1L0utPEJb0Ovg3KL7U2rShXGZxpBdKW9V", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 5", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1cfL9GpyAsRMRocxUU6ESiDC2eteo1OMZ", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 6", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=17LdGqYiX21E6dOl_xtmZNKaeZ744cpF-", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 7", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1hx2t8uKYwrKCEn5k_UwZQtnvUn8hfr0k", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 8", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=17L7yIwJ15iVaZFaWtAbh7847BVoDyWjU", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 9", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1DNascgeXxPgrrXwvnTugyUunS2eGWu4G", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 10", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1tYnH8Y-912p2-UR7biM9u6XcOta9Zncj", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 11", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1lK1PwzznvwhirYfRTHdPl5BTh6VwQvU2", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 12", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1KsXUu1n7Bm15zY2cbJZGietG6mz1kimS", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 13", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1nR2ETX_u8Mch6lDY5clhbwLBFeq9ujh2", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 14", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1x2j5t1JaP1gRQKgLpP-sYoCR2lVunHl", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 15", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1cVxIbOwKK7TYvRstyGvdJ5F2GpvQBZQS", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 16", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1Aqbdczjcfeh5VcMAgRnAI35DpABmLnn8", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 17", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1OFRtSbJ-sy5IuYvawr8g3uY4_s3oprz9", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 18", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1BEHgjlkHBW2madwcr5Ct39G0C0LTgcDI", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 19", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1UDg4i_Pp_mFPAgNygGTHyQ3qT5U70Aaf", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 20", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=10hg1WiqeTGOj8TleUWe68O_vVOTZDzYW", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 21", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=17KWJYJr7ep9lOg3AdMmm_TB665oVNBY-", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 22", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=10t2KVjaS8QgJ3X0gvNC5ejom8QNt0k80", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 23", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1yx4IfznTz3NVK2qL3puKxM0SmX_M_idO", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 24", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1GwJEkU53MU032YCiP-NlKDZZ0J-0mEac", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" },
        { name: "Season 2 Ep 25", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1EGDy6dtNO6M3Nx59Sc-jeO7YP1nOIZF6", logo: "https://m.media-amazon.com/images/M/MV5BY2QzODA5OTQtYWJlNi00ZjIzLThhNTItMDMwODhlYzYzMjA2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg" }
    ],
    "Jujutsu Kaisen": [
        // Season 1
        { name: "Season 1 Ep 1", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1MqXmWHDwaM839JKKgEJ9Lfxt8Na7Tq7A", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 2", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=16WAj5skJcMF9Sk58YPF2k-iDFYlzZGip", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 3", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1g8SzR5WTTv3bEY7D5jkcyVA-14kFbyZP", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 4", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1QsBmC9UbYUyKT-SEzGCsGx-vduYVtgvo", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 5", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1IPoCmFf4f_5JheMgSaf9lwoXGwqqqFz3", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 6", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1J-0g222Y40UbP2kUOQpcM8U_bRqSidhG", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 7", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1ZpPpDPZXQFrfi7SqvIqC3ejjFZg2fAyM", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 8", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1BL2ZUr9FzG9MgFAq2Rk_0m_KDKQnUJXx", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 9", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1D0ccpp2FDssQEGYShbpWsCoMaAngtKl5", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 10", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1Un6urHblUyrHvflVYASm-Z8OIASPw2rf", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 11", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1jBxyk7t8nDfNXfd8z0eMmAHIO2VTflxh", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 12", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1uE9xtGIDdiW66YXwWyRGlZvCJDraOHCw", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 13", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1_7JR6UPJ2v6aLHooeyFviOv6nm9GfPB0", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 14", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1plZu8-VRQ38uOAYLkcTEAVwSMBfbtt6p", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 15", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=13ik1Xe_o6Wnrk-iu7FMCH01bDYl1ZmO_", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 16", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1Sgtd_d1vIzZJJxTXBqerIx_5HE-Eu2Oi", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 17", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=11qwrRdj0lNhGz3-aNX3pgnaSPpewjzM1", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 18", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1tDHjCmfsiaYim5CCtEJJupQdpupByeQV", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 19", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1O6qcWIcl5zP6hwb0hO1vRszkkDoboSay", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 20", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1DqjHleJSJzixKigbXypVIgf_WKZL38VM", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 21", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1O82mA68p0nBjV-gJOGZPmmoL5IVDELiF", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 22", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1nuutzJUv2rMdDKoescP6Bq_iRAZ-I0_N", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 23", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1ggiV_aq6Bky-W1DHjRIn5FwV3NpXM15o", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" },
        { name: "Season 1 Ep 24", type: "mp4", manifestUri: "https://series.shakzz.workers.dev/?id=1260OmmY6K32-I-AEGFa1Z8W3aAU_DCBU", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRjuvmcnTukhzjYjeLI3j4yTNdUa_MUW4oJn5Fcge_jQ&s" }
    ]
};