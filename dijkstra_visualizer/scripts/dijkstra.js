function createDijkstraObject(nodeMap, startNode, endNode) {
    let nodes = nodeMap.nodes
    let unvisitedNodes = [startNode]
    let currentNode
    startNode.distance = 0

    function doStep() {
        currentNode = chooseBestNode()
        visitNode(currentNode)

        return currentNode
    }

    function visitNode (nodeToVisit) {
        let nodeToVisitIndex = nodes.indexOf(nodeToVisit)
        let nodeNeighbours = getUnvisitedNeighbours(nodeToVisitIndex)
        let tentativeDistance = nodeToVisit.distance + 1

        if (nodeNeighbours.length > 0) {
            for (let neighbour of nodeNeighbours) {
                if (neighbour.distance > tentativeDistance) {
                    neighbour.distance = tentativeDistance
                    neighbour.parent = nodeToVisit
                    unvisitedNodes.push(neighbour)
                }
            }
        }

        let visitedIndex = unvisitedNodes.indexOf(nodeToVisit)
        unvisitedNodes.splice(visitedIndex, 1)
        nodeToVisit.isVisited = true
    }

    function chooseBestNode() {
        let bestNode = unvisitedNodes[0]

        for (let unvisitedNode of unvisitedNodes) {
            if (unvisitedNode.distance < bestNode.distance) {
                bestNode = unvisitedNode
            }
        }

        return bestNode
    }

    function getUnvisitedNeighbours (nodeIndex) {
        let neighbours = []
        let unvisitedNeighbours = []

        if (nodeIndex > nodeMap.width) {
            neighbours.push(nodes[nodeIndex - nodeMap.width])
        }

        if (nodeIndex + nodeMap.width < nodeMap.size) {
            neighbours.push(nodes[nodeIndex + nodeMap.width])
        }

        if (( nodeIndex + 1 ) % nodeMap.width !== 0) {
            neighbours.push(nodes[nodeIndex + 1])
        }

        if (nodeIndex % nodeMap.width !== 0) {
            neighbours.push(nodes[nodeIndex - 1])
        }

        for (let neighbour of neighbours) {
            if (!neighbour.isVisited && !neighbour.isBlocked) {
                unvisitedNeighbours.push(neighbour)
            }
        }

        return unvisitedNeighbours
    }

    function checkIfDone() {
       return (unvisitedNodes.includes(endNode)) ? true : false
    }

    function tracePath(nodeToTrace) {
        pathNodes = []

        let pathHead = nodeToTrace
        while (pathHead.parent !== startNode) {
            pathHead = pathHead.parent
            pathNodes.push(pathHead)
        }

        return pathNodes
    }

    return {
        doStep,
        checkIfDone,
        tracePath,
        getUnvisitedNeighbours,
        nodes,
        unvisitedNodes,
        startNode,
        endNode
    }
}