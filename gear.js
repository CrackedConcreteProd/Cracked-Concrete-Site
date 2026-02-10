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
        dayRate: 60,
        weekRate: 240,
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
        dayRate: 100,
        weekRate: 400,
        status: "available"
      },
      {
        id: "cam-005",
        name: "SONY CCD-TRV608",
        subsection: "ANALOG",
        description: "Hi8 camcorder with 3-inch LCD and SteadyShot stabilization. Features analog-to-digital passthrough, NightShot, and that signature Sony Hi8 warmth.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=CCD-TRV608",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=TRV608+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=TRV608+LCD",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=TRV608+Side",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=TRV608+Tape"
        ],
        dayRate: 30,
        weekRate: 120,
        status: "available"
      },
      {
        id: "cam-006",
        name: "SONY DCR-TRV39",
        subsection: "ANALOG",
        description: "Compact MiniDV camcorder with Carl Zeiss Vario-Sonnar lens and Memory Stick slot. Touch-panel LCD, built-in flash, and DV-in/out for clean digital transfers.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=DCR-TRV39",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=TRV39+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=TRV39+LCD",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=TRV39+Top",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=TRV39+Side"
        ],
        dayRate: 20,
        weekRate: 80,
        status: "available"
      },
      {
        id: "cam-008",
        name: "SONY DCR-PC100",
        subsection: "ANALOG",
        description: "Ultra-compact MiniDV camcorder with Carl Zeiss lens and Mega Pixel CCD. Swivel design with 2.5-inch LCD, FireWire output, and smooth 10x optical zoom.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=DCR-PC100",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=PC100+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=PC100+Open",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=PC100+Side",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=PC100+Swivel"
        ],
        dayRate: 20,
        weekRate: 80,
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
        dayRate: 50,
        weekRate: 200,
        status: "available"
      },
      {
        id: "cam-009",
        name: "CANON ZOOM 318 SUPER 8",
        subsection: "ANALOG",
        description: "Classic Super 8 film camera with built-in 3x zoom lens. Automatic exposure, battery-powered motor drive, and that unmistakable Super 8 film grain and cadence.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=CANON+318",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=318+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=318+Top",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=318+Lens",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=318+Back"
        ],
        dayRate: 40,
        weekRate: 160,
        status: "available"
      }
    ]
  },
  lenses: {
    title: "LENSES",
    items: [
      {
        id: "lens-001",
        name: "SMC TAKUMAR LENS SET",
        subsection: "FULL FRAME",
        description: "Full set of vintage Asahi Pentax Super-Multi-Coated Takumars in M42 screw mount. All-metal construction, silky smooth focus, and 7-element multi-coated optics known for warm rendering and beautiful flare characteristics. Adaptable to any modern mount.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=SMC+TAKUMAR",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Takumar+Profile",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Takumar+Mount",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Takumar+Focus",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Takumar+Hood"
        ],
        dayRate: 50,
        weekRate: 250,
        status: "available"
      },
      {
        id: "lens-002",
        name: "SONY 24-70MM F2.8 GM II",
        subsection: "FULL FRAME",
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
        subsection: "SUPER 35",
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
      },
      {
        id: "lens-004",
        name: "VEGA-7 20MM F2",
        subsection: "MICRO FOUR THIRDS",
        description: "Soviet-era cine lens with a distinctive warm rendering and smooth bokeh. M42 mount adapted to MFT. A favorite for its dreamy, vintage character wide open.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=VEGA-7+20MM",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Vega7+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Vega7+Side",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Vega7+Mount",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Vega7+Barrel"
        ],
        dayRate: 25,
        weekRate: 100,
        status: "available"
      },
      {
        id: "lens-005",
        name: "VEGA-9 50MM F2.1",
        subsection: "MICRO FOUR THIRDS",
        description: "Classic Soviet portrait lens with buttery smooth focus throw and characterful rendering. Adapted to MFT for a 100mm equivalent — perfect for tight, intimate shots.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=VEGA-9+50MM",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Vega9+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Vega9+Side",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Vega9+Mount",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Vega9+Detail"
        ],
        dayRate: 25,
        weekRate: 100,
        status: "available"
      },
      {
        id: "lens-006",
        name: "LUMIX G X VARIO 12-35MM F2.8",
        subsection: "MICRO FOUR THIRDS",
        description: "Professional constant-aperture zoom for MFT. Weather-sealed, fast and quiet autofocus, and Nano Surface Coating for reduced flare. A versatile workhorse lens.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=LUMIX+12-35",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=12-35+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=12-35+Side",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=12-35+Mount",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=12-35+Hood"
        ],
        dayRate: 35,
        weekRate: 140,
        status: "available"
      }
    ]
  },
  lights: {
    title: "LIGHTS",
    items: [
      {
        id: "light-006",
        name: "APUTURE 200X S",
        subsection: "FIXTURES",
        description: "Compact 200W bi-color LED with 2700K-6500K range and Bowens mount. Built-in wireless control, quiet fan mode, and lightweight body. Punches well above its size for run-and-gun and studio setups alike.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=APUTURE+200XS",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=200XS+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=200XS+Back",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=200XS+Mount",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=200XS+Setup"
        ],
        dayRate: 60,
        weekRate: 300,
        status: "available"
      },
      {
        id: "light-005",
        name: "LOWEL TOTA LIGHT",
        subsection: "FIXTURES",
        qty: 2,
        description: "Classic Lowel Tota 750W tungsten flood lights. Wide, even throw with integrated barn doors and umbrella mount. Lightweight, foldable design — an industry standard for fast, punchy lighting on location.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=LOWEL+TOTA+x2",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Tota+Front",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Tota+Barn",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Tota+Folded",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Tota+Set"
        ],
        dayRate: 30,
        weekRate: 120,
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
  grip: {
    title: "GRIP + SUPPORT",
    items: [
      {
        id: "grip-001",
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
        id: "grip-002",
        name: "MANFROTTO 516 FLUID HEAD TRIPOD",
        description: "Professional fluid head tripod with 29lb payload capacity. Fluid cartridge drag system with continuous pan/tilt adjustment, 4-step counterbalance, dual telescopic handles, and bubble level. 100mm bowl compatible.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=MANFROTTO+516",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=516+Full",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=516+Head",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=516+Legs",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=516+Case"
        ],
        dayRate: 25,
        weekRate: 125,
        status: "available"
      },
      {
        id: "grip-003",
        name: "C-STAND",
        qty: 5,
        description: "Heavy-duty 40-inch chrome C-stands with grip heads and arms. Spring-loaded legs, stacking-friendly bases, and knuckle heads for mounting flags, nets, and modifiers.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=C-STANDS+x5",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=CStand+Full",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=CStand+Head",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=CStand+Arm",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=CStand+Set"
        ],
        dayRate: 20,
        weekRate: 80,
        status: "available"
      },
      {
        id: "grip-004",
        name: "LIGHTING STAND",
        qty: 3,
        description: "Lightweight aluminum light stands. Adjustable height up to 10 feet, air-cushioned sections, and standard 5/8-inch stud mount. Folds compact for transport.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=LIGHT+STANDS+x3",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Stand+Full",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Stand+Base",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Stand+Top",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Stand+Folded"
        ],
        dayRate: 15,
        weekRate: 60,
        status: "available"
      },
      {
        id: "grip-005",
        name: "TRIPLE RISER",
        description: "Heavy-duty triple riser stand for overhead and high-angle rigging. Extends up to 15 feet with three risers and a rocky mountain leg for uneven terrain. Steel construction.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=TRIPLE+RISER",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Riser+Full",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Riser+Top",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Riser+Base",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Riser+Detail"
        ],
        dayRate: 20,
        weekRate: 80,
        status: "available"
      },
      {
        id: "grip-006",
        name: "SANDBAG",
        qty: 7,
        description: "Heavy-duty 25lb saddle sandbags. Double-stitched cordura nylon with zippered fill ports. Essential for securing C-stands, light stands, and any rigging on set.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=SANDBAGS+x7",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Sandbag+Set",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Sandbag+Single",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Sandbag+Stand",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Sandbag+Detail"
        ],
        dayRate: 10,
        weekRate: 40,
        status: "available"
      },
      {
        id: "grip-007",
        name: "MOVING BLANKET",
        qty: 3,
        description: "Heavy-duty quilted moving blankets. Doubles as sound dampening, light blocking, surface protection, and improvised negative fill. A grip truck essential.",
        thumbnail: "https://placehold.co/400x300/1a55ff/e9fbff?text=BLANKETS+x3",
        photos: [
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Blanket+Folded",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Blanket+Open",
          "https://placehold.co/800x600/1a55ff/e9fbff?text=Blanket+Hung",
          "https://placehold.co/800x600/0b34ff/e9fbff?text=Blanket+Set"
        ],
        dayRate: 5,
        weekRate: 20,
        status: "available"
      }
    ]
  },
  misc: {
    title: "MISC",
    items: [
      {
        id: "misc-001",
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
      }
    ]
  }
};
