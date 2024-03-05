<template>
  <div>
    <canvas id="renderCanvas" style="width: 100%; height: 100%;"></canvas>
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
      var canvas = document.getElementById("renderCanvas");

      var engine = new BABYLON.Engine(canvas, true);

      var scene = new BABYLON.Scene(engine);
      //const newTexture = new BABYLON.Texture("http://localhost/3000/albedo.png")
      scene.createDefaultEnvironment({createGround:false, createSkybox:false}) // appearing texture
      // idk why, the default mesh is has texture but when implementing the  object just show black object. must add config at line:23

      BABYLON.SceneLoader.ImportMesh("", "/", "KapalPerang.glb", scene, function (meshes) {
        console.log("GLTF file loaded successfully");
        // meshes.forEach(function (mesh) {
        //   scene.mesh.material.albedoTexture = newTexture
        //   // var material = mesh.material;
        //   // if (material && material.diffuseTexture) {
        //   //   console.log("Texture loaded:", material.diffuseTexture.name);
        //   // }
        //   console.log(material)

        // });
      });

      engine.runRenderLoop(function () {
        scene.render();
      });

      window.addEventListener("resize", function () {
        engine.resize();
      });

      var camera = new BABYLON.ArcRotateCamera(
        "camera1",
        Math.PI / 2,
        Math.PI / 2,
        5,
        new BABYLON.Vector3(0, 0, 0),
        scene
      );

      camera.position.x = 0;
      camera.position.y = 5;
      camera.position.z = -5;

      camera.attachControl(canvas);

    }
  },
};
</script>

