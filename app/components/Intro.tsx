import React, { useEffect } from "react";
import { InterpolateLinear } from "three";
import  setupMarqueeAnimation  from "./../lib/marquee";

const Intro = () => {
  // useEffect(() => {
  //   setupMarqueeAnimation();
  // });
  return (
    <section className="intro">
        <h1>Maluję ściany, które opowiadają historie.</h1>
    </section>
  );
};

export default Intro;