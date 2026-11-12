
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

const viewer = document.getElementById("modelViewer");
const garmentSelect = document.getElementById("garment");
const colorPicker = document.getElementById("color");
const mannequinBtn = document.getElementById("mannequinBtn");
const rotateBtn = document.getElementById("rotateBtn");
const status = document.getElementById("status");
status.textContent = "JavaScript is running!";
const scene = new THREE.Scene();
scene.background = new THREE.Color("#17121f");

const camera = new THREE.PerspectiveCamera(
    40,
    viewer.clientWidth / viewer.clientHeight,
    0.1,
    100
);
camera.position.set(6, 4, 8);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(viewer.clientWidth, viewer.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;

viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 2.1, 0);
controls.minDistance = 4;
controls.maxDistance = 12;

scene.add(new THREE.AmbientLight("#ffffff", 1.5));

const mainLight = new THREE.DirectionalLight("#ffffff", 3);
mainLight.position.set(4, 8, 6);
mainLight.castShadow = true;
scene.add(mainLight);

const purpleLight = new THREE.PointLight("#bd8be8", 35);
purpleLight.position.set(-4, 3, -3);
scene.add(purpleLight);

const floor = new THREE.Mesh(
    new THREE.CircleGeometry(5, 64),
    new THREE.MeshStandardMaterial({
        color: "#28202f",
        roughness: 0.8
    })
);

floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.05;
floor.receiveShadow = true;
scene.add(floor);

const model = new THREE.Group();
scene.add(model);

const mannequin = new THREE.Group();
const clothing = new THREE.Group();

model.add(mannequin);
model.add(clothing);

const skinMaterial = new THREE.MeshStandardMaterial({
    color: "#d9b99e",
    roughness: 0.65
});

const darkMaterial = new THREE.MeshStandardMaterial({
    color: "#342a3c",
    roughness: 0.8
});

function addMesh(group, geometry, material, position) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
}


function createMannequin() {
    mannequin.clear();

    // Elegant neck
    addMesh(
        mannequin,
        new THREE.CylinderGeometry(0.14, 0.17, 0.32, 48),
        skinMaterial,
        [0, 3.65, 0]
    );

    // Smooth couture dress-form body
    const torsoProfile = new THREE.SplineCurve([
        new THREE.Vector2(0.34, 1.65),
        new THREE.Vector2(0.42, 1.82),
        new THREE.Vector2(0.43, 2.00),
        new THREE.Vector2(0.34, 2.18),
        new THREE.Vector2(0.29, 2.40),
        new THREE.Vector2(0.31, 2.58),
        new THREE.Vector2(0.39, 2.78),
        new THREE.Vector2(0.49, 2.98),
        new THREE.Vector2(0.48, 3.12),
        new THREE.Vector2(0.37, 3.28),
        new THREE.Vector2(0.25, 3.42)
    ]);

    const torsoGeometry = new THREE.LatheGeometry(
        torsoProfile.getPoints(100),
        96
    );

    addMesh(
        mannequin,
        torsoGeometry,
        skinMaterial,
        [0, 0, 0]
    );

    // Smooth top of the neck
    addMesh(
        mannequin,
        new THREE.SphereGeometry(0.14, 32, 32),
        skinMaterial,
        [0, 3.82, 0]
    );
}

function createTop(material, style) {
    const points = style === "crop"
        ? [
            new THREE.Vector2(0.37, 2.45),
            new THREE.Vector2(0.34, 2.62),
            new THREE.Vector2(0.42, 2.95),
            new THREE.Vector2(0.52, 3.25),
            new THREE.Vector2(0.27, 3.48)
        ]
        : [
            new THREE.Vector2(0.40, 2.05),
            new THREE.Vector2(0.36, 2.35),
            new THREE.Vector2(0.42, 2.85),
            new THREE.Vector2(0.53, 3.25),
            new THREE.Vector2(0.27, 3.48)
        ];

    const mesh = addMesh(
        clothing,
        new THREE.LatheGeometry(points, 48),
        material,
        [0, 0, 0]
    );

    mesh.material.side = THREE.DoubleSide;

    if (style === "shirt" || style === "jacket") {
        for (const side of [-1, 1]) {
            const sleeve = addMesh(
                clothing,
                new THREE.CylinderGeometry(0.13, 0.18, 0.55, 32),
                material,
                [side * 0.57, 3.05, 0]
            );

            sleeve.rotation.z = side * -0.35;
        }
    }

    if (style === "jacket") {
        const seam = new THREE.Mesh(
            new THREE.BoxGeometry(0.025, 1.1, 0.015),
            darkMaterial
        );
        seam.position.set(0, 2.75, 0.43);
        clothing.add(seam);
    }
}

function createDress(material) {
    const points = [
        new THREE.Vector2(0.4, 1.15),
        new THREE.Vector2(0.55, 1.45),
        new THREE.Vector2(0.48, 2.0),
        new THREE.Vector2(0.38, 2.4),
        new THREE.Vector2(0.43, 2.9),
        new THREE.Vector2(0.53, 3.25),
        new THREE.Vector2(0.27, 3.48)
    ];

    const dress = addMesh(
        clothing,
        new THREE.LatheGeometry(points, 48),
        material,
        [0, 0, 0]
    );

    dress.material.side = THREE.DoubleSide;
}

function createPants(material) {
    for (const side of [-1, 1]) {
        const leg = addMesh(
            clothing,
            new THREE.CylinderGeometry(0.17, 0.22, 1.8, 32),
            material,
            [side * 0.22, 0.95, 0]
        );

        leg.material.side = THREE.DoubleSide;
    }

    addMesh(
        clothing,
        new THREE.CylinderGeometry(0.42, 0.38, 0.32, 48),
        material,
        [0, 1.85, 0]
    );
}

function createGarment() {
    clothing.clear();

    const material = new THREE.MeshStandardMaterial({
        color: colorPicker.value,
        roughness: 0.55,
        metalness: 0.02,
        side: THREE.DoubleSide
    });

    const type = garmentSelect.value;

    if (type === "crop") {
        createTop(material, "crop");
    } else if (type === "shirt") {
        createTop(material, "shirt");
    } else if (type === "jacket") {
        createTop(material, "jacket");
    } else if (type === "dress") {
        createDress(material);
    } else if (type === "pants") {
        createPants(material);
    }
}

createMannequin();
createGarment();

garmentSelect.addEventListener("change", createGarment);
colorPicker.addEventListener("input", createGarment);

mannequinBtn.addEventListener("click", () => {
    mannequin.visible = !mannequin.visible;

    mannequinBtn.textContent = mannequin.visible
        ? "Hide Mannequin"
        : "Show Mannequin";
});

let rotating = false;

rotateBtn.addEventListener("click", () => {
    rotating = !rotating;
    controls.autoRotate = rotating;
    controls.autoRotateSpeed = 2;

    rotateBtn.textContent = rotating
        ? "Stop Rotation"
        : "Rotate Model";
});

function resizeViewer() {
    const width = viewer.clientWidth;
    const height = viewer.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);
}

new ResizeObserver(resizeViewer).observe(viewer);

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

animate();

status.textContent = "3D Studio Ready";
