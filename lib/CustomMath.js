export default class CustomMath {
    static choice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }

    // not really a normal distribution, but mirrors one
    // mean = 0, std =  1
    static randomNormal(nsamples = 10) {
        let total = 0;
        for (let i = 0; i < nsamples; i++) {
            total += Math.random();
        }

        return total / nsamples - 0.5;
    }
}
