class ROTATION {
  directionRotation = ["left", "right"];
  getDirectionRotation({ ...props }) {
    const { valueRotationX, newValueRotationX } = props;
    return this.rulesRotation(valueRotationX, newValueRotationX);
  }
  rulesRotation(valueRotationX: any, newValueRotationX: any) {
    if (valueRotationX > newValueRotationX) {
      return this.directionRotation[0];
    }
    if (valueRotationX < newValueRotationX) {
      return this.directionRotation[1];
    }
  }
}

export const rotateTool = ({ ...props }) => {
  const DRAG_PIXEL_SENSITIVITY = 30;

  const { ROTATIONS } = props;
  let startIndex = 0;


  return {
    active: true,
    enabled: true,
    key: "rotate_2D_photo",
    handlers: {
      drag: (ev: any) => {
        const startPos = ev.isTouch ? ev.clientX : ev.originalEvent.clientX;

        const optionsCount = ROTATIONS.length;
        let deltaIdx = 0;

        let starRotationAngle = window.configurator.getConfiguration()['Rotation Angle']
        ROTATIONS.forEach((angle: any, index: any) => {
          if (angle === starRotationAngle) {
            startIndex = index;
          }
        });

        return {
          handle: (ev: any) => {
            const newClientX = ev.isTouch
              ? ev.clientX
              : ev.originalEvent.clientX;

            const newDeltaIdx = Math.floor(
              (newClientX - startPos) / DRAG_PIXEL_SENSITIVITY
            );

            if (newDeltaIdx !== deltaIdx) {
              let rotation = new ROTATION();
              let directionRotation = rotation.getDirectionRotation({
                valueRotationX: deltaIdx,
                newValueRotationX: newDeltaIdx,
              });

              if (directionRotation === "right") {
                startIndex = startIndex - 1;
                if (startIndex < 0) {
                  //   startIndex = optionsCount - 1;
                  startIndex = 0
                }
              } else if (directionRotation === "left") {
                startIndex = startIndex + 1;
                if (startIndex > optionsCount - 1) {
                  //   startIndex = 0;
                  startIndex = optionsCount - 1
                }
              }

              deltaIdx = newDeltaIdx;
              if(starRotationAngle !== ROTATIONS[startIndex]){
                window.configurator.setConfiguration({
                  "Rotation Angle": ROTATIONS[startIndex],
                });
              }
            }
          },
        };
      },
    },
  };
};

export function getRotationAngles() {
  let rotationAttribute = window.configurator
    .getAttributes()
    .filter((attribute: any) => attribute["name"].includes("Rotation Angle"));
  let ROTATIONS = [];
  if (rotationAttribute.length > 0) {
    let minAngle = rotationAttribute[0]["min"];
    let maxAngle = rotationAttribute[0]["max"];
    let stepAngle = rotationAttribute[0]["step"];
    let i: any = minAngle;

    while (i <= maxAngle) {
      ROTATIONS.push(i);
      i = Number(Number.parseFloat(i + stepAngle).toFixed(2));
    }
    return {
      ROTATIONS: ROTATIONS.reverse(),
      maxAngle,
      minAngle,
      stepAngle,
    };
  }
  return null;
}
