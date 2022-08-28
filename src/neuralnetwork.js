class NeuralNetwork {
    constructor(neuronCounts) {
        this.layers = [];

        for (let i = 0; i < neuronCounts.length - 1; i++) {
            this.layers.push(new Layer(neuronCounts[i], neuronCounts[i + 1]));
        }
    }
    static feedForward(inputVals, network) {
        let outputs = Layer.feedForward(inputVals, network.layers[0]);

        for (let i = 1; i < network.layers.length; i++) {
            outputs = Layer.feedForward(outputs, network.layers[i]);
        }

        return outputs;
    }

    static mutate(network, mutationRate = 1) {
        network.layers.forEach(layer => {
            for (let i = 0; i < layer.biases.length; i++) {
                layer.biases[i] = lerp(layer.biases[i], Math.random() * 2 - 1, mutationRate);
            }
            for (let i = 0; i < layer.weights.length; i++) {
                for (let j = 0; j < layer.weights[i].length; j++) {
                    layer.weights[i][j] = lerp(layer.weights[i][j], Math.random() * 2 - 1, mutationRate);
                }
            }
        });
    }
}

class Layer {
    constructor(inputSize, outputSize) {
        this.inputs = new Array(inputSize);
        this.outputs = new Array(outputSize);
        this.biases = new Array(outputSize);

        this.weights = [];

        for (let x = 0; x < inputSize; x++) {
            this.weights[x] = new Array(outputSize);
        }

        Layer.randomise(this);
    }

    static randomise(layer) {
        for (let x = 0; x < layer.inputs.length; x++) {
            for (let y = 0; y < layer.outputs.length; y++) {
                layer.weights[x][y] = Math.random() * 2 - 1;
            }
        }

        for (let i = 0; i < layer.biases.length; i++) {
            layer.biases[i] = Math.random() * 2 - 1;
        }
    }

    static feedForward(inputVals, layer) {
        for (let i = 0; i < layer.inputs.length; i++) {
            layer.inputs[i] = inputVals[i];
        }

        for (let i = 0; i < layer.outputs.length; i++) {
            let sum = 0;
            for (let j = 0; j < layer.inputs.length; j++) {
                sum += layer.inputs[j] * layer.weights[j][i];
            }

            layer.outputs[i] = Math.tanh(sum + layer.biases[i]);
        }

        return layer.outputs;
    }
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}