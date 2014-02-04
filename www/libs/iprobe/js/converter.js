var converter = {
    psiToBar: function(psi) {
        var bar = psi * 0.06894757293168;
        return bar;
    },
    barToPsi: function(bar) {
        var psi = bar * 14.503773773022;
        return psi;
    },
    celsiusToFahrenheit: function(celsius) {
        var fahrenheit = ((9 * celsius) / 5) + 32;
        return fahrenheit;
    },
    fahrenheitToCelsius: function(fahrenheit) {
        var celsius = ((fahrenheit - 32) * 5) / 9;
        return celsius;
    },
    round: function(number, fix) {
        return number.toFixed(fix);
    }
}