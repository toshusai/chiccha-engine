return {
    onKeyPress_a = function()
        self.moveX(-1)
    end,

    onKeyPress_d = function()
        self.moveX(1)
    end,

    onUpdate = function()
        self.moveY(-0.1)
    end
}
