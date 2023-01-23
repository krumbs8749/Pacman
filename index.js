const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const scoreEL = document.querySelector("#score")
canvas.width = map[0].length*42
canvas.height = map.length*42
class Boundary {
    static width = 40
    static height = 40
    constructor({position, image}) {
        this.position = position;
        this.width = 40
        this.height = 40
        this.image = image
    }
    draw(){
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class Player {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.radians = .75
        this.openRate = .12
        this.rotation = 0
    }
    draw(){
        c.save()
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath()
        c.arc(
            this.position.x,
            this.position.y,
            this.radius,
            this.radians,
            2*Math.PI - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow'
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if(this.radians < 0 || this.radians > .75) this.openRate = - this.openRate
        this.radians += this.openRate
    }
}
class Ghost {
    static speed = 1

    constructor({position, velocity, color = 'red'}) {
        this.position = position
        this.velocity = velocity
        this.radius = 15
        this.color = color
        this.speed = Ghost.speed
        this.prevCollisons = []
        this.scared = false
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI)
        c.fillStyle = this.scared ? 'blue' : this.color
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Pellet {
    constructor({position, velocity}) {
        this.position = position
        this.radius = 3
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI)
        c.fillStyle = 'white'
        c.fill()
        c.closePath()
    }
}
class PowerUp {
    constructor({position, velocity}) {
        this.position = position
        this.radius = 5
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, 2*Math.PI)
        c.fillStyle = 'orange'
        c.fill()
        c.closePath()
    }
}

const powerUps = []
const pellets = []
const boundaries = []
const ghosts = [
    new Ghost({
        position: {
            x: 6 * Boundary.width + Boundary.width/2,
            y: Boundary.width + Boundary.width/2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'red'
    }),
    new Ghost({
        position: {
            x: 6 * Boundary.width + Boundary.width/2,
            y: Boundary.width + Boundary.width/2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'white'
    }),
    new Ghost({
        position: {
            x: 6 * Boundary.width + Boundary.width/2,
            y: Boundary.width + Boundary.width/2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'green'
    }),
    new Ghost({
        position: {
            x: 6 * Boundary.width + Boundary.width/2,
            y: Boundary.width + Boundary.width/2
        },
        velocity: {
            x: Ghost.speed,
            y: 0
        },
        color: 'pink'
    }),

]
const player = new Player({
    position: {
        x: Boundary.width + Boundary.width/2,
        y: Boundary.width + Boundary.width/2
    },
    velocity: {
        x: 0,
        y: 0
    }
})
const keys = {
    w: {
        pressed: false,
        value: -5
    },
    a: {
        pressed: false,
        value: -5
    },
    s: {
        pressed: false,
        value: 5
    },
    d: {
        pressed: false,
        value: 5
    },
}
let lastKey = ''
let scoreCount = 0

const createImage = (src) => {

    const image = new Image()
    image.src = src
    return image
}
map.forEach((row, i) => {
    row.forEach((cell, j) => {
        switch (cell) {
            case '-':
                boundaries.push(new Boundary({
                    position: {
                        x: j * Boundary.width,
                        y: i * Boundary.height
                    },
                    image: createImage("./img/pipeHorizontal.png")
                }))
                break
            case '|':
                boundaries.push(new Boundary({
                    position: {
                        x: j * Boundary.width,
                        y: i * Boundary.height
                    },
                    image: createImage("./img/pipeVertical.png")
                }))
                break
            case '1':
                boundaries.push(new Boundary({
                    position: {
                        x: j * Boundary.width,
                        y: i * Boundary.height
                    },
                    image: createImage("./img/pipeCorner1.png")
                }))
                break
            case '2':
                boundaries.push(new Boundary({
                    position: {
                        x: j * Boundary.width,
                        y: i * Boundary.height
                    },
                    image: createImage("./img/pipeCorner2.png")
                }))
                break
            case '3':
                boundaries.push(new Boundary({
                    position: {
                        x: j * Boundary.width,
                        y: i * Boundary.height
                    },
                    image: createImage("./img/pipeCorner3.png")
                }))
                break
            case '4':
                boundaries.push(new Boundary({
                    position: {
                        x: j * Boundary.width,
                        y: i * Boundary.height
                    },
                    image: createImage("./img/pipeCorner4.png")
                }))
                break
            case 'b':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        },
                        image: createImage('./img/block.png')
                    })
                )
                break
            case '[':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width,
                            y: i * Boundary.height
                        },
                        image: createImage('./img/capLeft.png')
                    })
                )
                break
            case ']':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width,
                            y: i * Boundary.height
                        },
                        image: createImage('./img/capRight.png')
                    })
                )
                break
            case '_':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width,
                            y: i * Boundary.height
                        },
                        image: createImage('./img/capBottom.png')
                    })
                )
                break
            case '^':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width,
                            y: i * Boundary.height
                        },
                        image: createImage('./img/capTop.png')
                    })
                )
                break
            case '+':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width,
                            y: i * Boundary.height
                        },
                        image: createImage('./img/pipeCross.png')
                    })
                )
                break
            case '5':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width,
                            y: i * Boundary.height
                        },
                        color: 'blue',
                        image: createImage('./img/pipeConnectorTop.png')
                    })
                )
                break
            case '6':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width,
                            y: i * Boundary.height
                        },
                        color: 'blue',
                        image: createImage('./img/pipeConnectorRight.png')
                    })
                )
                break
            case '7':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width,
                            y: i * Boundary.height
                        },
                        color: 'blue',
                        image: createImage('./img/pipeConnectorBottom.png')
                    })
                )
                break
            case '8':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: j * Boundary.width,
                            y: i * Boundary.height
                        },
                        image: createImage('./img/pipeConnectorLeft.png')
                    })
                )
                break
            case '.':
                pellets.push(
                    new Pellet({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        }
                    })
                )
                break
            case 'p':
                powerUps.push(
                    new PowerUp({
                        position: {
                            x: j * Boundary.width + Boundary.width / 2,
                            y: i * Boundary.height + Boundary.height / 2
                        }
                    })
                )
                break

        }
    })
})

const circleCollidesWithRect = ({circle, rect}) => {
    const padding = Boundary.width / 2 - circle.radius - 1
    return(circle.position.y - circle.radius + circle.velocity.y <= rect.position.y + rect.height + padding
        && circle.position.x + circle.radius + circle.velocity.x >= rect.position.x -  padding
        && circle.position.y + circle.radius + circle.velocity.y >= rect.position.y -  padding
        && circle.position.x - circle.radius + circle.velocity.x <= rect.position.x + rect.width + padding)
}
let animationID
const animate = () => {

    animationID = requestAnimationFrame(animate)
    // Win Condition
    if(pellets.length === 0){
        cancelAnimationFrame(animationID)
    }
    c.clearRect(0, 0, canvas.width, canvas.height)

    switch (true){
        case keys.w.pressed && lastKey == 'w':
            for(let i = 0; i< boundaries.length; i++ ) {
                if(circleCollidesWithRect({
                    circle: {
                        ...player,
                        velocity: {
                            x: 0,
                            y: -5
                        }
                    },
                    rect: boundaries[i]
                })){
                    player.velocity.y = 0
                    break
                }else{
                    player.velocity.y = keys.w.value
                }
            }
            break
        case keys.a.pressed && lastKey == 'a':
            for(let i = 0; i< boundaries.length; i++ ) {
                if(circleCollidesWithRect({
                    circle: {
                        ...player,
                        velocity: {
                            x: -5,
                            y: 0
                        }
                    },
                    rect: boundaries[i]
                })){
                    player.velocity.x = 0
                    break
                }else{
                    player.velocity.x = keys.a.value
                }
            }
            break
        case keys.s.pressed && lastKey == 's':
            for(let i = 0; i< boundaries.length; i++ ) {
                if(circleCollidesWithRect({
                    circle: {
                        ...player,
                        velocity: {
                            x: 0,
                            y: 5
                        }
                    },
                    rect: boundaries[i]
                })){
                    player.velocity.y = 0
                    break
                }else{
                    player.velocity.y = keys.s.value
                }
            }
            break
        case keys.d.pressed && lastKey == 'd':
            for(let i = 0; i< boundaries.length; i++ ) {
                if(circleCollidesWithRect({
                    circle: {
                        ...player,
                        velocity: {
                            x: 5,
                            y: 0
                        }
                    },
                    rect: boundaries[i]
                })){
                    player.velocity.x = 0
                    break
                }else{
                    player.velocity.x = keys.d.value
                }
            }
            break
    }
    for(let i = powerUps.length - 1; i >= 0; i--){
        const powerUp = powerUps[i]
        powerUp.draw()

        if(Math.hypot(powerUp.position.x - player.position.x,
                powerUp.position.y - player.position.y)
            < player.radius + powerUp.radius){
            powerUps.splice(i,1)

            // make ghost scared
            ghosts.forEach(ghost => {
                ghost.scared = true
                setTimeout(() => {
                    ghost.scared = false
                }, 5000)
            })
        }
    }
    for(let i = pellets.length - 1; i >= 0; i--){
        const pellet = pellets[i]
        pellet.draw()

        if(Math.hypot(pellet.position.x - player.position.x,
            pellet.position.y - player.position.y)
            < player.radius + pellet.radius){
            pellets.splice(i,1)
            scoreCount++
            scoreEL.innerHTML = scoreCount
        }
    }

    for(let i = ghosts.length - 1; i >= 0; i--){
        const ghost = ghosts[i]
        if(Math.hypot(ghost.position.x - player.position.x,
                ghost.position.y - player.position.y)
            < player.radius + ghost.radius){

            if(ghost.scared){
                ghosts.splice(i, 1)
            }else{
                cancelAnimationFrame(animationID)
            }
        }

    }
    boundaries.forEach(d => {
        d.draw()
        if(circleCollidesWithRect({circle: player, rect: d})){

            player.velocity.x = 0
            player.velocity.y = 0
        }
    })
    player.update()
    ghosts.forEach(ghost => {
        ghost.update()



        const collisions = []
        boundaries.forEach(boundary => {
            if(!collisions.includes('right') && circleCollidesWithRect({
                circle: {...ghost, velocity: {x: ghost.speed, y: 0}},
                rect: boundary})){
                collisions.push('right')
            }
            if(!collisions.includes('left') && circleCollidesWithRect({
                circle: {...ghost, velocity: {x: -ghost.speed, y: 0}},
                rect: boundary})){
                collisions.push('left')
            }
            if(!collisions.includes('up') && circleCollidesWithRect({
                circle: {...ghost, velocity: {x: 0, y: -ghost.speed}},
                rect: boundary})){
                collisions.push('up')
            }
            if(!collisions.includes('down') && circleCollidesWithRect({
                circle: {...ghost, velocity: {x: 0, y: ghost.speed}},
                rect: boundary})){
                collisions.push('down')
            }
        })

        if(collisions.length > ghost.prevCollisons){
            ghost.prevCollisons = collisions
        }
        if(JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisons)){

            if(ghost.velocity.x > 0) ghost.prevCollisons.push('right')
            else if(ghost.velocity.x < 0) ghost.prevCollisons.push('left')
            else if(ghost.velocity.y < 0) ghost.prevCollisons.push('up')
            else if(ghost.velocity.y > 0) ghost.prevCollisons.push('down')

            const pathways = ghost.prevCollisons.filter(collision => {
                return !collisions.includes(collision)
            })

            const direction = pathways[Math.floor(Math.random() * pathways.length)]
            switch (direction){
                case 'right':
                    ghost.velocity.x = ghost.speed
                    ghost.velocity.y = 0
                    break
                case 'left':
                    ghost.velocity.x = -ghost.speed
                    ghost.velocity.y = 0
                    break
                case 'up':
                    ghost.velocity.x = 0
                    ghost.velocity.y = -ghost.speed
                    break
                case 'down':
                    ghost.velocity.x = 0
                    ghost.velocity.y = ghost.speed
                    break
            }

            ghost.prevCollisons = []
        }

    })
    if(player.velocity.x > 0) player.rotation = 0
    if(player.velocity.x < 0) player.rotation = -Math.PI
    if(player.velocity.y < 0) player.rotation = - Math.PI / 2
    if(player.velocity.y > 0) player.rotation = Math.PI / 2

}
animate()

window.addEventListener('keydown', ({key}) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true
            lastKey='w'
            break
        case 'a':
            keys.a.pressed = true
            lastKey='a'
            break
        case 's':
            keys.s.pressed = true
            lastKey='s'
            break
        case 'd':
            keys.d.pressed = true
            lastKey='d'
            break
    }
})

window.addEventListener('keyup', ({key}) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break
    }
})

