// import { System } from "../../ecs/System.js";
// import { SystemGroupType } from "../../ecs/SystemGroup.js";

// /**
//  * Provide time related information.
//  * @class TimeSystem
//  */
// export class TimeSystem extends System {
//   _frameCount = 0;
//   _deltaTime = 0;
//   _actualDeltaTime = 0;
//   _elapsedTime = 0;
//   _actualElapsedTime = 0;
//   _lastSystemTime;

//   /** Maximum delta time allowed per frame in seconds. */
//   maximumDeltaTime = 0.333333;

//   /** The scale of time. */
//   timeScale = 1.0;

//   /**
//    * Constructor of the Time.
//    */
//   constructor(world) {
//     super(world);
//     this.groupId = SystemGroupType.PreUpdate;
//     this.index = 10;

//     this._lastSystemTime = performance.now() / 1000;
//   }
//   /**
//    * @internal
//    */
//   _reset() {
//     this._lastSystemTime = performance.now() / 1000;
//   }

//   /**
//    * @internal
//    */
//   _update() {
//     const currentSystemTime = performance.now() / 1000;

//     const actualDeltaTime = currentSystemTime - this._lastSystemTime;
//     this._actualDeltaTime = actualDeltaTime;
//     this._actualElapsedTime += actualDeltaTime;

//     const deltaTime = Math.min(actualDeltaTime, this.maximumDeltaTime) * this.timeScale;
//     this._deltaTime = deltaTime;
//     this._elapsedTime += deltaTime;
//     this._frameCount++;

//     this._lastSystemTime = currentSystemTime;
//   }

// }
