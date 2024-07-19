return {
    onStart = function()
        delta = self.random() * 32
        self.moveX(delta)
    end,

    onUpdate = function()
        self.moveY(-0.2)
    end,

    onCollisionEnter_bullet = function()
        self.changeImage('DAMAGE_IMAGE_1', 'DAMAGE_IMAGE_2', 'DAMAGE_IMAGE_3')
        self.gameClear()
    end
}
