const sizeButton = document.getElementById('size-button')
const widthInput = document.getElementById('width-input')
const heightInput = document.getElementById('height-input')
const blockButton = document.getElementById('block-button')
const startButton = document.getElementById('start-button')
const endButton = document.getElementById('end-button')
const clearButton = document.getElementById('clear-button')
const visualizeButton = document.getElementById('visualize-button')

mapTable.addEventListener('click', doCurrentFuctionOnNode)
sizeButton.addEventListener('click', setMapSize)
blockButton.addEventListener('click', function() {currentFunction = blockNode})
startButton.addEventListener('click', function() {currentFunction = setStartNode})
endButton.addEventListener('click', function() {currentFunction = setEndNode})
clearButton.addEventListener('click', clearMap)
visualizeButton.addEventListener('click', visualizeAlgorithm)

let myMap = createMapObject(15, 10)
let startingNode
let endingNode
let isRunning = false
let currentFunction = function() {}

function setMapSize() {
    myMap = createMapObject(+widthInput.value, +heightInput.value)
    myMap.render()
    startingNode = undefined
    endingNode = undefined
}

function clearMap() {
    myMap = createMapObject(myMap.width, myMap.height)
    myMap.render()
    startingNode = undefined
    endingNode = undefined
}

function doCurrentFuctionOnNode() {
    tdClicked = event.target
    if (tdClicked.tagName === 'TD') {
        let tdRowIndex = tdClicked.parentElement.rowIndex
        let tdIndex = tdClicked.cellIndex + ( tdRowIndex * myMap.width )
        let clickedNode = myMap.nodes[tdIndex]

        currentFunction(clickedNode)
    }
}

function blockNode(blockedNode) {
    if (blockedNode === startingNode || blockedNode === endingNode) {
        return
    }
    if (blockedNode.isBlocked) {
        blockedNode.isBlocked = false
        blockedNode.colorIndex = 0
    } else {
        blockedNode.isBlocked = true
        blockedNode.colorIndex = 1
    }

    myMap.render()
}

function setStartNode(newStartNode) {
    if (newStartNode === endingNode) {
        return
    }
    if (startingNode !== undefined) {
        startingNode.colorIndex = 0
    }
    startingNode = newStartNode
    startingNode.colorIndex = 3
    startingNode.isBlocked = false

    myMap.render()
}

function setEndNode(newEndNode) {
    if (newEndNode === startingNode) {
        return
    }
    if (endingNode !== undefined) {
        endingNode.colorIndex = 0
    }
    endingNode = newEndNode
    endingNode.colorIndex = 4
    endingNode.isBlocked = false

    myMap.render()
}

function visualizeAlgorithm() {
    if (startingNode === undefined || endingNode === undefined) {
        return
    }

    mapTable.style.pointerEvents = 'none'
    visualizeButton.innerHTML = 'Stop Algorithm'
    visualizeButton.removeEventListener('click', visualizeAlgorithm)
    visualizeButton.addEventListener('click', stopAlgorithm)
    isRunning = true

    let myDijkstra = new createDijkstraObject(myMap, startingNode, endingNode)

    startAlgorithm(myDijkstra, 100)
}

function startAlgorithm(algorithm, speed) {
    let nodeToAnimate = algorithm.doStep()

    if (!isRunning) {
        return
    }

    if (nodeToAnimate !== algorithm.startNode) {
        nodeToAnimate.colorIndex = 2
    }

    if (algorithm.checkIfDone()) {
        let path = algorithm.tracePath(algorithm.endNode)

        for (pathNode of path) {
            pathNode.colorIndex = 5
        }
        
        stopAlgorithm()
        return
    }

    if (algorithm.unvisitedNodes.length > 0) {
        return setTimeout(function() {
            startAlgorithm(algorithm, speed)
            myMap.render()
        }, speed)
    }
    stopAlgorithm()
}

function stopAlgorithm() {
    visualizeButton.innerHTML = 'Reset Map'
    visualizeButton.removeEventListener('click', stopAlgorithm)
    visualizeButton.addEventListener('click', resetMap)
    mapTable.style.pointerEvents = 'all'
    isRunning = false
}

function resetMap() {
    visualizeButton.innerHTML = 'Visualize Algorithm'
    visualizeButton.removeEventListener('click', resetMap)
    visualizeButton.addEventListener('click', visualizeAlgorithm)

    for (let i = 0; i < myMap.nodes.length; i++) {
        let nodeToReset = myMap.nodes[i]
        nodeToReset.distance = Infinity
        nodeToReset.parent = undefined
        nodeToReset.isVisited = false
        if ( nodeToReset !== startingNode && nodeToReset !== endingNode && !nodeToReset.isBlocked) {
            nodeToReset.colorIndex = 0
        }
    }

    myMap.render()
}

myMap.render()