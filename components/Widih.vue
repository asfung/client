<template>
  <div>
    <canvas id="renderCanvas"></canvas>
  </div>
</template>

<script>
// import '@babylonjs/loaders'
export default {
  mounted() {
    this.$nextTick(() => {
      this.createScene();
    });
  },
  methods: {
    createScene(){
      // Access the canvas element after the component has been mounted
      var canvas = document.getElementById("renderCanvas");

      // Create a Babylon.js engine
      var engine = new BABYLON.Engine(canvas, true);

      // Create a scene
      var scene = new BABYLON.Scene(engine);

      // Load the GLTF file
      BABYLON.SceneLoader.ImportMesh("", "./KapalPerang.glb", "", scene, function (meshes) {
        // Do something with the loaded meshes
        console.log("GLTF file loaded successfully");
        meshes.forEach(function (mesh) {
          console.log("Mesh loaded:", mesh.name);
        });
        // You can manipulate the loaded meshes here, add animations, etc.
      });

      // Run the render loop
      engine.runRenderLoop(function () {
        scene.render();
      });

      // Resize the Babylon engine on window resize
      window.addEventListener("resize", function () {
        engine.resize();
      });

      // Create a camera
      var camera = new BABYLON.ArcRotateCamera(
        "camera1",
        Math.PI / 2,
        Math.PI / 2,
        10,
        new BABYLON.Vector3(0, 0, 0),
        scene
      );

      // Set the camera's position
      camera.position.x = 0;
      camera.position.y = 10;
      camera.position.z = -10;

      // Attach the camera to the canvas
      camera.attachControl(canvas);

    }
    // createScene() {
    //   this.canvas = document.getElementById("renderCanvas");
    //   this.engine = new BABYLON.Engine(this.canvas);
    //   let scene = new BABYLON.Scene(this.engine);
    //   // this.canvas.width = this.canvas.offsetWidth;
    //   // this.canvas.height = this.canvas.offsetHeight;

    //   let camera = new BABYLON.FreeCamera(
    //     "camera1",
    //     new BABYLON.Vector3(0, 5, -10),
    //     scene
    //   );
    //   camera.setTarget(new BABYLON.Vector3.Zero());
    //   camera.attachControl(this.canvas, false);
    //   let light = new BABYLON.HemisphericLight(
    //     "light1",
    //     new BABYLON.Vector3(0, 1, 0),
    //     scene
    //   );
    //   let sphere = new BABYLON.Mesh.CreateSphere(
    //     "sphere1",
    //     16,
    //     1,
    //     scene,
    //     false,
    //     BABYLON.Mesh.FRONTSIDE
    //   );
    //   sphere.position.y = 1;
    //   let ground = new BABYLON.Mesh.CreateGround(
    //     "ground1",
    //     6,
    //     6,
    //     2,
    //     scene,
    //     false
    //   );

    //   // Handling mouse wheel events for camera zoom
    //   this.canvas.addEventListener("wheel", (event) => {
    //     // Prevent the default behavior to stop page scrolling
    //     event.preventDefault();

    //     // Adjust the camera position based on the wheel delta
    //     camera.position.z += event.deltaY / 100;
    //   });

    //   // Handling keyboard input for camera movement
    //   window.addEventListener("keydown", (event) => {
    //     switch (event.key) {
    //       case "ArrowUp" && "w":
    //         camera.position.z += 0.1;
    //         break;
    //       case "ArrowDown" && "s":
    //         camera.position.z -= 0.1;
    //         break;
    //       case "ArrowLeft" && "a":
    //         camera.position.x -= 0.1;
    //         break;
    //       case "ArrowRight" && "d":
    //         camera.position.x += 0.1;
    //         break;
    //     }
    //   });

    //   // Update the scene before rendering
    //   scene.onBeforeRenderObservable.add(() => {
    //     // Additional logic for continuous movement or other updates
    //   });

    //   this.engine.runRenderLoop(function () {
    //     scene.render();
    //   });

    //   // Resize the Babylon engine on window resize
    //   window.addEventListener("resize", () => {
    //     this.engine.resize();
    //   });
    // },
  },
};
</script>

