import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStartThreekit } from "../../store/selectors/selectors";
import { loadConfig, setViewAngle } from "../../store/actions/Settings";
import load3kit from "../../utils/load3kit";
import s from "./PlayerThreeKit.module.scss";
import { getRotationAngles, rotateTool } from "../../threekit/rotation2DPhoto";
import { getAllPriceProduct, getPriceRings } from "../../utils/api";
declare global {
  interface Window {
    threekitPlayer: any;
    player: any;
    configurator: any;
  }
}

export const THREEKIT_PARAMS = {
  threekitUrl: "https://preview.threekit.com/",
  authToken: "63da27fb-e8c1-461d-a1cb-76721081b3c9",
  assetId: "d0088bc7-4ef9-4382-84d7-03cbfd7b9e4c",
  elementId: "2afa5b5f-48fe-4f28-8e0f-a1b8acb0aac0",
  orgId: "fb84f021-82c5-44b2-bbd0-5565b2661a1c",
}


export const PlayerThreeKit = () => {
  const dispatch = useDispatch();

  const [loaded, setLoaded] = useState(false);
  const playerEl: any = React.createRef();
  const startThreeKit = useSelector(getStartThreekit);
  const init3kit = () => {
    if (!playerEl.current) return false;

    if (window.threekitPlayer) {

      console.log(startThreeKit);


      window
        .threekitPlayer({
          authToken: THREEKIT_PARAMS['authToken'],
          el: playerEl.current,
          
          assetId: THREEKIT_PARAMS['assetId'],
          initialConfiguration: startThreeKit,
          showLoadingProgress: {
            loadingImage: false,
          },
          display: "image",
        })
        .then(async (api: any) => {
          window.player = api;
          // await api.when('preloaded');
          // await window.player.when('loaded');

          api.tools.removeTool('zoom');
          window.configurator = await api.getConfigurator();
          await window.configurator.prefetchAttributes(['Rotation Angle'])



          // let productsPrice = await getPriceRings()
          // let productsPrice = await getAllPriceProduct()
          let productsPrice: any = {}
          await dispatch(loadConfig({ listPrice: productsPrice }));
          if (!!getRotationAngles()) {
            let props: any = getRotationAngles();
            await dispatch(setViewAngle(props));
            await window.player.tools.addTool(rotateTool(props));
          }

        });
    }
  };

  useEffect(() => {
    load3kit(null, () => {
      setLoaded(true);
      init3kit();
    });
  });

  return (
    <div className={s.player_wrapper}>
      {loaded ? <div id="player" className={s.player} ref={playerEl} /> : ""}
    </div>
  );
}
// export const PlayerThreeKit = () => {
//   const dispatch = useDispatch();

//   const [loaded, setLoaded] = useState(false);
//   const playerEl: any = React.createRef();

//   // const init3kit = () => {
//   //   if (!playerEl.current) return false;

//   //   if (window.threekitPlayer) {
//   //     window
//   //       .threekitPlayer({
//   //         authToken: "d56cf180-8322-4ab9-9907-a1588cbc540b",
//   //         el: playerEl.current,
//   //         assetId: "2afa5b5f-48fe-4f28-8e0f-a1b8acb0aac0",
//   //         initialConfiguration: startThreeKitObject,
//   //         // showConfigurator: "true",
//   //         display: "image",
//   //       })
//   //       .then(async (api: any) => {
//   //         window.player = api;
//   //         api.tools.addTool('zoom')
//   //         dispatch(loadConfig());
//   //         window.configurator = await api.getConfigurator();
//   //       });
//   //   }
//   // };

//   // let query = URLSearchParams(useLocation().search);

//   useEffect(() => {



//   }, [playerEl]);

//   launch({ ...THREEKIT_PARAMS, playerEl, callback: () => setLoaded(true) })
//   .then((res) => {




//     dispatch(loadConfig());
//   })

//   return (
//     <div className={s.player_wrapper}>
//       {loaded ? <div id="player" className={s.player} ref={playerEl} /> : ""}
//     </div>
//   );
// };



