var juice ={
    Shake(sprt, pos, speed, mag){
        sprt.position.setTo(
            pos.x + mag * Math.sin(game.time.now * speed) * game.rnd.integerInRange(-mag, mag),
            pos.y + mag * Math.cos(game.time.now * speed) * game.rnd.integerInRange(-mag, mag)
        );
    },
    HorizontalStretch(sprt, base, speed, mag){
        // var baseScale = 1;
        // var speed = 0.01;
        // var magnitude = 0.7;
        sprt.scale.setTo(
            base + mag * Math.sin(game.time.now * speed),
            base + mag * Math.cos(game.time.now * speed)
        );
    }
}