const mapTable = document.getElementById('map-table')
const nodeColors = ['#ffffff', '#243f39', '#fdffbf', '#bfeaff', '#ff9883', '#f6ff70']

class node {
    constructor(distance, parent, isVisited, isBlocked, colorIndex) {
        this.distance = distance
        this.parent = parent
        this.isVisited = isVisited
        this.isBlocked = isBlocked
        this.colorIndex = colorIndex
    }
}

function createMapObject(width, height) {
    let mapWidth = width
    let mapHeight = height
    let mapSize = mapWidth * mapHeight
    let myNodes = []

    let mapNodeAmmount = mapSize
    for (let i = 0; i < mapNodeAmmount; i++) {
        myNodes.push(new node(Infinity, undefined, false, false, 0))
    }

    function render () {
        let html = ''
    
        for (let row = 0; row < mapHeight; row++) {
            html += '<tr>'
    
            for (let column = 0; column < mapWidth; column++) {
                nodeIndex = column + ( row * mapWidth )
                let colorIndex = myNodes[nodeIndex].colorIndex

                html += `<td style="background-color:${nodeColors[colorIndex]};"></td>`
            }
    
            html += '</tr>'
        }
    
        mapTable.innerHTML = html
    }

    return {
        render,
        nodes: myNodes,
        width: mapWidth,
        height: mapHeight,
        size: mapSize
    }
}