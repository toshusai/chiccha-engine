shot = 0
return {
    onKeyPress_a = function()
        if shot == 0 then
            self.moveX(-1)
        end
    end,

    onKeyPress_d = function()
        if shot == 0 then
            self.moveX(1)
        end
    end,

    onKeyDown_z = function()
        self.moveY(-64 - 12)
        shot = 1
    end,

    onCollisionEnter_enemy = function()
        self.moveX(128)
    end,

    onUpdate = function()
        if shot == 1 then
            self.moveY(-1)
        else
            self.moveY(-0.1)
        end
    end
}

