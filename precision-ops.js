// @name          BigNum Operators
// @author        Zach R (Zro617/Zro716)
// @version       2.0
// @lastCommit    September 22, 2017
/**
 * Code adapted from http://scratch.mit.edu/projects/51335450/
 *
 * If you can find faster methods of doing some of these things,
 * especially supporting fractional exponents, let me know!
 * http://scratch.mit.edu/users/Zro716
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

if (!ScratchExtensions) { exit }
function register(extensionName) {
    const descriptor = {
        blocks: [
            ['b', 'installed precision operators?', 'installed'],

            ['r', '%s + %s', '_add', '', ''],
            ['r', '%s - %s', '_sub', '', ''],
            ['r', '%s * %s', '_mult', '', ''],
            ['r', '%s / %s', '_div', '', ''],
            ['r', '%s \\ %s', '_idiv', '', ''],
            ['r', '%s ^ %s', '_exp', '', ''],
            ['r', '%s th root of %s', '_nrt', '', ''],
            ['r', '%s !', '_fact', ''],
            ['r', '%s mod %s', '_mod', '', ''],
            ['r', 'round %s', '_rnd', ''],
            ['r', '%m.bnfn of %s', '_fn', 'sqrt', '9'],

            ['b', '%s is %m.bnprop ?', '_prop', '', 'number'],

            ['b', '%s > %s', '_gt', '', ''],
            ['b', '%s < %s', '_lt', '', ''],
            ['b', '%s = %s', '_eq', '', ''],
            ['b', '%s != %s', '_neq', '', ''],

            ['r', 'random', '_rand'],
            ['r', 'pick random from %s to %s', '_pick', '', ''],
            ['r', 'maximum of %s and %s', '_max', '', ''],
            ['r', 'minimum of %s and %s', '_min', '', ''],

            ['r', 'pi', 'pi'],
            ['r', 'precision', 'get_precision'],
            ['r', 'iterations', 'get_iterations'],
            ['b', 'using Taylor series?', 'get_taylor'],

            [' ', 'set precision to %n decimal places', 'set_precision', 10],
            [' ', 'set iterations to %n', 'set_iterations', 10],
            [' ', 'set Taylor series flag to %b', 'set_taylor', false]
        ],
        menus: {
            bnprop: [
                'NaN','number','infinity','finite',
                'zero','nonzero','positive','negative',
                'integer','decimal','normal',
                'even','odd'
            ],
            bnfn: [
                'abs','opposite','floor','ceiling',
                'square','cube','sqrt','cbrt',
                '2^','10^','e^','log2','log10','ln',
                'sin','cos','tan','csc','sec','cot',
                'asin','acos','atan','acsc','asec','acot',
                'sinh','cosh','tanh','csch','sech','coth',
                'asinh','acosh','atanh','acsch','asech','acoth',
                'versin','vercos','coversin','covercosin',
                'haversin','havercos','hacoversin','hacovercosin',
                'exsec','excsc'
            ]
        }
    }

    const ext = {}

    // unused methods
    ext._shutdown = function () {}
    ext._getStatus = function () {
        return { status: 2, msg: 'Ready' }
    }
    ext.installed = function () {
        return true
    }

    ext.get_precision = function () {
        return BigNum.precision
    }
    ext.set_precision = function (p) {
        BigNum.precision = Math.max(0,Math.round(p))
    }

    ext.get_iterations = function () {
        return BigNum.maxIterations
    }
    ext.set_iterations = function (i) {
        BigNum.maxIterations = Math.max(0,Math.round(i))
    }

    ext.get_taylor = function () {
        return BigNum.usingTaylorSeries
    }
    ext.set_taylor = function (t) {
        BigNum.usingTaylorSeries = !!t
    }

    ext.pi = function () {
        return '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679'
    }

    ext._add  = BigNum.add
    ext._sub  = BigNum.sub
    ext._mult = BigNum.mult
    ext._div  = BigNum.div
    ext._idiv = BigNum.idiv
    ext._mod  = BigNum.mod
    ext._pow  = BigNum.pow
    ext._nrt  = BigNum.nrt
    ext._fact = BigNum.fct
    ext._rnd  = BigNum.round
    ext._max  = BigNum.max
    ext._min  = BigNum.min
    ext._rand = BigNum.random
    ext._pick = BigNum.randomFrom
    ext._gt   = BigNum.gt
    ext._lt   = BigNum.lt
    ext._eq   = BigNum.eq
    ext._neq  = BigNum.neq

    ext._prop = function (property, x) {
        switch (property.toLowerCase()) {
            case 'nan':
                return BigNum.isNaN(x)
            case 'number':
                return BigNum.isNumber(x)
            case 'infinity':
            case 'infinite':
                return BigNum.isInfinite(x)
            case 'finite':
                return BigNum.isFinite(x)
            case 'zero':
            case '0':
                return BigNum.isZero(x)
            case 'nonzero':
            case 'notzero':
            case 'not zero':
                return BigNum.isNotZero(x)
            case 'positive':
                return BigNum.isPositive(x)
            case 'negative':
                return BigNum.isNegative(x)
            case 'integer':
            case 'integral':
                return BigNum.isInteger(x)
            case 'decimal':
            case 'float':
            case 'floating-point':
                return BigNum.isDecimal(x)
            case 'even':
                return BigNum.isEven(x)
            case 'odd':
                return BigNum.isOdd(x)
            default:
                return false
        }
    }
    ext._fn = function (operation, x) {
        switch (operation) {
            case '2^':
                return BigNum.pow2(x)
            case '10^':
                return BigNum.pow10(x)
            case 'e^':
                return BigNum.powE(x)
            case 'log10':
            case 'log2':
                return 'Not supported!'
            default:
                try {
                    return BigNum[operation](x)
                } catch (e) {
                    return 0
                }
        }
    }

    ScratchExtensions.register(extensionName, descriptor, ext)
}

let BigNumURL = 'https://zro617.github.io/src/js/bignum.js'
ScratchExtensions.loadExternalJS(BigNumURL)
// Wait for library to load then register
document.querySelector('head>script[src="'+BigNumURL+'"]').onload = register.bind(window,'BigNum Operators')
