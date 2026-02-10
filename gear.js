// GEAR RENTAL DATA
const GEAR_DATA = {
  cameras: {
    title: "CAMERAS",
    items: [
      {
        id: "cam-001",
        name: "RED KOMODO 6K",
        subsection: "DIGITAL",
        description: "Full-frame 4K cinema camera with exceptional low-light performance. Features dual base ISO, 10-bit 4:2:2 internal recording, and S-Cinetone color science.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=RED+KOMODO",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=FX3+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=FX3+Side",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=FX3+Back",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=FX3+Top"
        ],
        dayRate: 200,
        weekRate: 800,
        status: "available" // available, rented, maintenance
      },
      {
        id: "cam-004",
        name: "PANASONIC LUMIX GH5",
        subsection: "DIGITAL",
        description: "Micro Four Thirds mirrorless camera with 4K 60fps 10-bit internal recording. Dual image stabilization, V-Log L, and weather-sealed magnesium alloy body.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=LUMIX+GH5",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=GH5+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=GH5+Back",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=GH5+Top",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=GH5+Side"
        ],
        dayRate: 40,
        weekRate: 160,
        status: "available"
      },
      {
        id: "cam-002",
        name: "CANON XL2",
        subsection: "ANALOG",
        description: "Professional 3CCD MiniDV camcorder with interchangeable lens system. 20x fluorite zoom lens, XLR audio inputs, and progressive scan mode for a filmic look.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=CANON+XL2",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=XL2+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=XL2+LCD",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=XL2+Lens",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=XL2+Detail"
        ],
        dayRate: 50,
        weekRate: 200,
        status: "available"
      },
      {
        id: "cam-003",
        name: "SONY VX1000",
        subsection: "ANALOG",
        description: "Legendary MiniDV camcorder with 3CCD image system and optical image stabilization. The camera that defined indie filmmaking and skate video culture.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=SONY+VX1000",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=VX1000+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=VX1000+Screen",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=VX1000+Side",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=VX1000+Ports"
        ],
        dayRate: 175,
        weekRate: 875,
        status: "rented"
      },
      {
        id: "cam-005",
        name: "SONY HI8 HANDYCAM CCD-TRV65",
        subsection: "ANALOG",
        description: "Classic Hi8 camcorder with SteadyShot stabilization and NightShot infrared mode. Produces the warm, lo-fi analog texture that defined 90s home video.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=HI8+HANDYCAM",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Hi8+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Hi8+LCD",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Hi8+Side",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Hi8+Tape"
        ],
        dayRate: 75,
        weekRate: 375,
        status: "available"
      },
      {
        id: "cam-006",
        name: "PANASONIC AG-DVX100",
        subsection: "ANALOG",
        description: "Pioneering MiniDV camcorder with true 24p progressive recording. Leica Dicomar lens, manual focus ring, and CineGamma curves for a cinematic look on tape.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=AG-DVX100",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=DVX100+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=DVX100+Back",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=DVX100+Top",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=DVX100+Lens"
        ],
        dayRate: 100,
        weekRate: 500,
        status: "available"
      },
      {
        id: "cam-007",
        name: "JVC KY-210",
        subsection: "ANALOG",
        description: "Professional broadcast-grade 3-tube camera with S-VHS recording. Known for its rich, saturated color reproduction and classic broadcast look. A workhorse of 80s/90s television production.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=JVC+KY-210",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=KY210+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=KY210+Side",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=KY210+Viewfinder",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=KY210+Back"
        ],
        dayRate: 60,
        weekRate: 300,
        status: "available"
      }
    ]
  },
  lenses: {
    title: "LENSES",
    items: [
      {
        id: "lens-001",
        name: "SMC Takumar Lens Set",
        description: "Full set of SMC (Super-Multi-Coated) Takumars. Covers full frame sensors.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=SMC+TAKUMAR",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Sigma+Profile",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Sigma+Mount",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Sigma+Focus",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Sigma+Hood"
        ],
        dayRate: 50,
        weekRate: 250,
        status: "available"
      },
      {
        id: "lens-002",
        name: "SONY 24-70MM F2.8 GM II",
        description: "Professional standard zoom for full-frame Sony E-mount. Weather-sealed, fast autofocus, and razor-sharp throughout the zoom range.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=SONY+24-70",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=GM+II+Side",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=GM+II+Front",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=GM+II+Rear",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=GM+II+Detail"
        ],
        dayRate: 60,
        weekRate: 300,
        status: "available"
      },
      {
        id: "lens-003",
        name: "CANON 70-200MM F2.8 L IS III",
        description: "Legendary telephoto zoom with image stabilization. Perfect for portraits, events, and sports. Weather-sealed professional build quality.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=CANON+70-200",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=70-200+Full",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=70-200+Hood",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=70-200+Mount",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=70-200+Controls"
        ],
        dayRate: 55,
        weekRate: 275,
        status: "maintenance"
      }
    ]
  },
  lights: {
    title: "LIGHTS",
    items: [
      {
        id: "light-001",
        name: "APUTURE 600D PRO",
        description: "Professional 600W daylight LED with exceptional output. Features Bluetooth/DMX control, silent operation, and industry-leading color accuracy (CRI 96+, TLCI 97+).",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=APUTURE+600D",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=600D+Unit",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=600D+Reflector",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=600D+Case",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=600D+Setup"
        ],
        dayRate: 100,
        weekRate: 500,
        status: "available"
      },
      {
        id: "light-002",
        name: "APUTURE 300X BI-COLOR",
        description: "Versatile 300W bi-color LED. Adjustable color temperature 2700K-6500K. Includes lighting control box, carrying case, and barn doors.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=APUTURE+300X",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=300X+Full",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=300X+Control",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=300X+Barn",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=300X+Kit"
        ],
        dayRate: 75,
        weekRate: 375,
        status: "available"
      },
      {
        id: "light-003",
        name: "GODOX VL300 LED PANEL",
        description: "Bright LED panel light with adjustable color temperature. Features built-in wireless control, DMX compatibility, and barn doors included.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=GODOX+VL300",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=VL300+Panel",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=VL300+Back",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=VL300+Diffuser",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=VL300+Stand"
        ],
        dayRate: 40,
        weekRate: 200,
        status: "available"
      },
      {
        id: "light-004",
        name: "NANLITE PAVOTUBE 30C (4-PACK)",
        description: "RGB tube lights perfect for creative lighting. Each tube is 2ft, battery-powered, and fully color controllable via app. Includes charging case.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=PAVOTUBE",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Tubes+Pack",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Tubes+RGB",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Tubes+Case",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Tubes+Setup"
        ],
        dayRate: 60,
        weekRate: 300,
        status: "available"
      }
    ]
  },
  monitors: {
    title: "CRT TELEVISIONS",
    items: [
      {
        id: "mon-001",
        name: "ATOMOS SHOGUN 7",
        description: "Professional 7-inch HDR monitor/recorder. 3000 nit brightness, supports RAW recording from compatible cameras. Includes SSD mounting and control via AtomOS.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=SHOGUN+7",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Shogun+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Shogun+Menu",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Shogun+Mount",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Shogun+Case"
        ],
        dayRate: 75,
        weekRate: 375,
        status: "available"
      },
      {
        id: "mon-002",
        name: "SMALLHD 702 BRIGHT",
        description: "Ultra-bright 7-inch on-camera monitor with 2200 nit display. Features 3D LUTs, waveform, false color, and professional monitoring tools.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=SMALLHD+702",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=702+Display",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=702+Side",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=702+Rig",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=702+Tools"
        ],
        dayRate: 65,
        weekRate: 325,
        status: "available"
      }
    ]
  },
  accessories: {
    title: "ACCESSORIES",
    items: [
      {
        id: "acc-001",
        name: "DJI RS3 PRO GIMBAL",
        description: "Professional 3-axis gimbal stabilizer. 10lb payload capacity, automated axis locks, and extended battery life. Includes focus motor and carrying case.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=DJI+RS3",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=RS3+Full",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=RS3+Folded",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=RS3+Motor",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=RS3+Case"
        ],
        dayRate: 85,
        weekRate: 425,
        status: "available"
      },
      {
        id: "acc-002",
        name: "RODE WIRELESS PRO",
        description: "Professional wireless microphone system with 32-bit float recording. Includes 2 transmitters, 1 receiver, and charging case. Timecode sync capable.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=RODE+PRO",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Rode+Set",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Rode+TX",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Rode+RX",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Rode+Case"
        ],
        dayRate: 50,
        weekRate: 250,
        status: "rented"
      },
      {
        id: "acc-003",
        name: "MANFROTTO TRIPOD KIT",
        description: "Professional carbon fiber tripod with fluid video head. Supports up to 17.6lb. Includes spreader, carrying bag, and quick-release plate.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=TRIPOD",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Tripod+Full",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Tripod+Head",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Tripod+Legs",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Tripod+Bag"
        ],
        dayRate: 25,
        weekRate: 125,
        status: "available"
      }
    ]
  }
};
