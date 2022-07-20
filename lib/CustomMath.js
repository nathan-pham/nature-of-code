export default class CustomMath {
    static choice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    static random(min = 0, max = 1) {
        return Math.random() * (max - min) + min;
    }
}
