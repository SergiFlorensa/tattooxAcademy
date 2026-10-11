import DfmMark from "./dfm-mark";

// The backdrop contains only vectors. It scales without enlarging poster pixels.
export default function StudioBackdrop() {
  return <div className="studio-backdrop" aria-hidden="true">
    <svg className="studio-backdrop-lines" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="dfm-portrait-outline" clipPathUnits="objectBoundingBox">
          <path d="M.33 .006C.2-.005 .1 .04 .11 .2C.1 .28 .15 .35 .26 .405C.24 .46 .23 .54 .23 .6L.2 .72C.14 .78 .01 .84 0 .9L0 .98C.25 .96 .42 .93 .6 .85L.75 .78C.9 .76 1 .75 1 .65C1 .54 .92 .46 .78 .4L.52 .35C.53 .31 .54 .25 .54 .19C.53 .08 .48 .01 .33 .006Z" />
        </clipPath>
      </defs>
      <g stroke="#43c6d8" strokeWidth="1" opacity=".12">
        <path d="M-120 470C230 35 698-45 1100 95S1490 360 1740 150" />
        <path d="M-120 490C230 55 698-25 1100 115S1490 380 1740 170" />
        <path d="M-120 510C230 75 698-5 1100 135S1490 400 1740 190" />
      </g>
      <g stroke="#76f07e" strokeWidth="1" opacity=".09">
        <path d="M520 1080C730 795 850 640 1180 675S1530 850 1720 555" />
        <path d="M540 1080C750 815 870 660 1200 695S1550 870 1740 575" />
      </g>
      <path d="m-65 194 151-177 56 7-171 196 31-67-42 56Z" fill="#43c6d8" opacity=".65" />
      <path d="m-18 266 171-193-24 61-132 153Z" fill="#43c6d8" opacity=".22" />
      <path d="m1485 936 147-184 39 15-161 196 22-51-38 35Z" fill="#76f07e" opacity=".6" />
      <path d="m1428 1013 163-197-24 67-113 137Z" fill="#43c6d8" opacity=".3" />
      <g stroke="#76f07e" strokeWidth="1.5" opacity=".2">
        <path d="M1482 118h24m-12-12v24M111 768h18m-9-9v18" />
      </g>
    </svg>
    <div className="hero-emblem"><DfmMark /></div>
  </div>;
}
