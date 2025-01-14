import gsap from 'gsap';

export default class Portal {
    constructor(portal, ubik, player) {
        this.portal = portal;
        this.ubik = ubik;
        this.player = player;
        this.tileSize = 2; // Assuming the tile size is 2 units
        this.animationRunning = false;
        this.nextLevel = false;
    }

    initAnimation() {
        this.animationTimeline = gsap.to({}, {
            duration: 1,
            repeat: -1,
            onUpdate: () => {
                const progress = this.animationTimeline.time() % 1;
                let frameIndex;

                if (progress < 0.25) {
                    frameIndex = 1;
                } else if (progress < 0.5) {
                    frameIndex = 2;
                } else if (progress < 0.75) {
                    frameIndex = 3;
                } else {
                    frameIndex = 4;
                }

                const textureName = `portal_frame${frameIndex}`;
                const texture = this.ubik.assets.get(textureName);

                if (texture && this.portal.mesh) {
                    this.portal.mesh.material.map = texture;
                    this.portal.mesh.material.needsUpdate = true;
                }
            }
        });
    }

    update(dt) {
        this.checkCollisionWithPlayer();
    }

    checkCollisionWithPlayer() {
        const playerPos = this.player.character.position;
        const portalPos = this.portal.position;

        if (Math.abs(playerPos.x - portalPos.x) < this.tileSize / 2 &&
            Math.abs(playerPos.y - portalPos.y) < this.tileSize / 2) {
            console.log("Player has entered the portal!");
            console.log(this.player.hasKey, this.animationRunning);
            if (!this.animationRunning && this.player.hasKey) {
                console.log("Portal animation started!");
                this.animationRunning = true;
                this.initAnimation();
                setTimeout(() => {
                    this.nextLevel = true;
                }, 500);
            }
        }
    }

    // Getter for nextLevel
    getNextLevel() {
        return this.nextLevel;
    }

    // Setter for nextLevel
    setNextLevel(value) {
        this.nextLevel = value;
    }
}
