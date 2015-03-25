/* @name          EnhancedPrecisionOperators
 * @author        Zach R
 * @version       1.0.7
 * @lastCommit    March 24, 2015
 *
 *
 * 
 * I'm gonna be honest here, I don't know much about JavaScript
 * so all this code is made in pure un-imported JS. I've noticed
 * others have made code for this in much better ways but I prefer
 * to reinvent things and improve my JS skillz.
 *
 * The biggest reason for making this extension is precision issues.
 * ECMAScript languages can only store numbers with at most 14-15 digits.
 * The code here is translated directly from a Scratch project that I also made.
 * Link to project here: http://scratch.mit.edu/projects/51335450/
 *
 * If you can find faster methods of doing some of these things,
 * especially supporting fractional exponents, let me know at
 * http://scratch.mit.edu/users/Zro716
 *
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Fields:
 *  - pi (String)
 *  - precision (Integer)
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * Methods:
 *  + _shutdown  = not used for now
 *  + _getStatus = not used for now
 *
 *  + installed     = checks that the extension is in use
 *  + get_precision = returns the current precision (int)
 *  + get_pi        = returns the precalculated value of pi
 *
 *  + set_max_precision = sets precision for all method (with restrictions of course)
 *  + calc_pi           = uses the Gauss-Legendre algorithm to calculate pi to some digits
 *
 *  + do_add     = take two large numbers and do addition/subtraction
 *  + do_sub     = take two large numbers, invert right operand and send them to do_add
 *  + do_mult    = take two large numbers and do classic multiplication
 *  + do_div     = take two large numbers and do long division
 *  + do_exp     = take one large number and an integer; supports only positive integer exponents
 *  + do_mod     = take two large numbers and do the modulo function
 *  + do_fact    = take one integer and do factorial multiplication
 *  + do_sqrt    = take one large number and do Babylonian method until desired result
 *  + do_abs     = take one large number and return the absolute value
 *  + do_round   = take one large number and remove all decimal places
 *
 *  + count_int  = take one number and count its integer places
 *  + count_dec  = take one number and count its decimal places
 *
 *  + trim       = remove trailing and leading zeroes
 *  + negate     = invert a number's sign
 *  + check_sign = check if a number is +, -, or 0
 *  + check_num  = check if a number is an integer, decimal, not a number (NaN), or +/- infinity
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */


(function (ext) {
    // extension fields
    var pi = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
    var precision = 20;

    // blocks to be added
    var descriptor = {
        blocks: [
            [' ', 'set max precision to %n digits', 'set_max_precision', 50],
            [' ', 'calculate pi to %n digits', 'calc_pi', 100],
            ['b', 'installed EPO extension?', 'installed'],
            ['r', 'pi', 'get_pi'],
            ['r', 'precision', 'get_precision'],
            ['r', '%s + %s', 'do_add', '', ''],
            ['r', '%s - %s', 'do_sub', '', ''],
            ['r', '%s * %s', 'do_mult', '', ''],
            ['r', '%s / %s', 'do_div', '', ''],
            ['r', '%s ^ %s', 'do_exp', '', ''],
            ['r', '%s mod %s', 'do_mod', '', ''],
            ['r', '%s !', 'do_fact', ''],
            ['r', 'sqrt of %s', 'do_sqrt', ''],
            ['r', 'abs of %s', 'do_abs', ''],
            ['r', 'round %s', 'do_round', ''],
            ['r', 'decimal places of %s', 'count_dec', ''],
            ['r', 'negate %s', 'negate', ''],
            ['r', 'trim %s', 'trim', ''],
            ['r', '%s is %m.PosNegZero ?', 'check_sign', '', 'negative'],
            ['r', '%s is %m.IntDecNaNInf ?', 'check_num', '', 'integer']
        ],
        menus: {
            PosNegZero: ['positive', 'negative', 'zero'],
            IntDecNaNInf: ['integer', 'decimal', 'NaN', 'infinity']
        }
    };


    // unused methods
    ext._shutdown = function () {};
    ext._getStatus = function () {
        return {
            status: 2,
            msg: 'Ready'
        };
    };


    // getters
    ext.get_pi = function () {
        return pi;
    };
    ext.get_precision = function () {
        return precision;
    };
    ext.installed = function () {
        return true;
    };

    // setters
    ext.set_max_precision = function (digits) {
        if (digits < 0) precision = 0;
        //else if (digits > 10240) precision = 10240;
        else precision = Math.round(digits);
    };

    // http://en.wikipedia.org/wiki/Gauss-Legendre_algorithm
    ext.calc_pi = function (digits) {
        if (digits < 0) return 0;
        if (pi.length - 2 == precision) return pi;
        else {
            var oldprecision = precision;
            var oldpi = pi;

            set_max_precision(digits);
            pi = 0;

            var a = 1,
                an, ab;
            var b = do_div(1, do_sqrt(2));
            var t = 0.25;
            var p = 1;

            while (pi != oldpi) {
                pi = oldpi;

                an = do_div(do_add(a, b), 2);
                b = do_sqrt(do_mult(a, b));
                ab = do_mult(a, b);
                t = do_sub(t, do_mult(p, do_mult(ab, ab)));
                p = do_mult(p, 2);
                a = an;

                ab = do_add(a, b);
                oldpi = do_div(do_mult(ab, ab), do_mult(4, t));
            }

            precision = oldprecision;
        }
    };

    ///////////////////////////////////
    // Enhanced arithmetic functions //
    ///////////////////////////////////

    ext.do_add = function (n1, n2) {
        n1 = String(n1);
        n2 = String(n2);
        
        // Preventive measure for numbers within native accuracy
        if (n1.length < 15 && n2.length < 15) return Number(n1) + Number(n2);

        // determine placements of the decimals and count integer places vs decimal places
        var n1_intCount = count_int(n1);
        var n1_decCount = count_dec(n1);
        var n1_signed = (n1.indexOf('-') === '0');
        var n2_intCount = count_int(n2);
        var n2_decCount = count_dec(n2);
        var n2_signed = (n2.indexOf('-') === '0');

        // convert to arrays
        n1 = n1.split('');
        n2 = n2.split('');

        // remove negation signs
        if (n1_signed) n1.del(0);
        if (n2_signed) n2.del(0);

        // remove decimal points
        if (n1_decCount) n1.del(n1.indexOf('.'));
        if (n2_decCount) n2.del(n2.indexOf('.'));

        // align summands
        while (n1_intCount != n2_intCount && n1_decCount != n2_decCount) {
            if (n1_intCount > n2_intCount) {
                n2.insert(0, '0');
                n2_intCount++;
            } else if (n2_intCount > n1_intCount) {
                n1.insert(0, '0');
                n1_intCount++;
            }
            if (n1_decCount > n2_decCount) {
                n2.add('0');
                n2_decCount++;
            } else if (n2_decCount > n1_decCount) {
                n1.add('0');
                n1_decCount++;
            }
        }

        // perform parallel digit-wise addition or subtraction

        var result = new Array(n1.length);
        var n1_digit, n2_digit;
        var calc = 0,
            carry = 0;

        for (var idx = result.length - 1; idx > 0; idx--) {
            n1_digit = n1[idx];
            n2_digit = n2[idx];
            if (n1_signed === n2_signed) {
                calc = n1_digit + n2_digit + carry;
            } else {
                if (n1_signed) {
                    calc = n2_digit - n1_digit + carry;
                } else {
                    calc = n1_digit - n2_digit + carry;
                }
            }
            carry = Math.floor(calc / 10);
            result[result.length - idx] = calc % 10;
        }
        if (carry) result.insert(0,carry % 10);

        // insert decimal point
        if (n1_decCount) result.insert(result.length - (n1_decCount + 1), '.');

        // check if the result should be negative
        if (n1_signed === n2_signed) {
            if (n1_signed) result.insert(0, '-');
        } else if (carry < 0) {
            carry = 0;
            for (idx = result.length - 1; idx > 0; idx++) {
                calc = result[idx];
                if (calc != '.') {
                    calc = carry - calc;
                    carry = Math.floor(calc / 10);
                    result[idx] = calc % 10;
                }
            }
            result.insert(0, '-');
        }

        result = trim(result);
        return String(result);
    };

    ext.do_sub = function (n1, n2) {
        /* The addition algorithm above works for
         * negative numbers as well, so save some
         * redundant coding and use that instead.
         */
        return do_add(n1, negate(n2));
    };

    ext.do_mult = function (n1, n2) {
        n1 = String(n1);
        n2 = String(n2);
        
        // Preventive measure for numbers within native accuracy
        if (n1.length + n2.length < 13) return Number(n1) * Number(n2);
        
        // preparations
        var n1_decCount = count_dec(n1);
        var n1_signed = (n1.indexOf('-') === '0');
        var n2_decCount = count_dec(n2);
        var n2_signed = (n2.indexOf('-') === '0');

        var signed = (n1_signed != n2_signed);

        // convert to arrays
        n1 = n1.split('');
        n2 = n2.split('');

        // remove negation signs
        if (n1_signed) n1.del(0);
        if (n2_signed) n2.del(0);

        // remove decimal points
        if (n1_decCount) n1.del(n1.indexOf('.'));
        if (n2_decCount) n2.del(n2.indexOf('.'));

        var result = new Array(n1.length + n2.length);

        var n1_digit, n2_digit, r_i;

        // perform long multiplication
        for (var n1_i = 1; n1_i < n1.length; n1_i++) {
            r_i = result.length - n1_i;
            n1_digit = n1[n1.length - n1_i];
            carry = 0;
            for (var n2_i = n2.length - 1; n2_i >= 0; n2_i--) {
                n2_digit = n2[n2_i];
                calc = n1_digit * n2_digit + result[r_i] + carry;
                carry = Math.floor(calc / 10);
                result[r_i] = calc % 10;
                r_i--;
            }
            while (r_i > -1) {
                calc = result[r_i] + carry;
                carry = Math.floor(calc / 10);
                result[r_i] = calc % 10;
                r_i--;
            }
        }
        // insert a decimal point
        var dec = n1_decCount + n2_decCount;
        if (dec) result.insert(result.length - (dec + 1), '.');

        // negate result
        if (signed) result.insert(0, '-');

        result = trim(result);
        return result;
    };

    ext.do_div = function (n1, n2) {
        if (Number(n2) == 0) return (Number(n1) == 0) ? 'NaN' : 'Infinity';
        if (Number(n1) === '0') return 0;

        n1 = String(n1).split(''); // Convert to arrays
        n2 = String(n2).split('');

        // Check if denominator has a decimal point, and if so
        // count the decimal places and shift it by a magnitude
        // until it is an integer.  Extend the numerator with
        // zeroes then move its decimal point equally.

        var i, temp;
        var dec = n2.indexOf('.') + 1;
        if (dec) {
            var decPlaces = n2.length - dec;
            n1.del(dec - 1);

            for (i = 0; i < decPlaces; i++) n1.add('0');

            dec = n1.indexOf('.') + 1;
            if (dec) {
                for (i = 0; i < decPlaces; i++) {
                    temp = n1[dec - 1];
                    n1[dec - 1] = n1[dec];
                    n1[dec] = temp;
                    dec++;
                }
            }
        }

        // Remove negation signs
        var sign = 1;
        if (n1.indexOf('-') > -1) {
            n1.del(0);
            sign *= -1;
        }
        if (n2.indexOf('-') > -1) {
            n2.del(0);
            sign *= -1;
        }

        dec = 0; // decimal places
        var rem = ""; // remainder
        var result = []; // quotient
        var divcount; // counter for subtractions from remainder

        i = 0;
        while (dec < precision || i < n1.length || rem > 0) {
            if (result.indexOf('.') > -1) dec++;

            divcount = 0;
            temp = n1[i];

            if (temp == '.') {
                // Decimal place found
                result.add('.');
            } else {
                // Append the next digit to remainder
                if (i < n1.length) {
                    rem += temp.toString();
                } else {
                    if (result.indexOf('.') == -1) result.add('.');
                    if (rem !== '0') rem += '0';
                }

                // Do long division
                if (rem.length >= n2.length) {
                    while (rem > n2) {
                        rem = do_sub(rem, n2);
                        divcount++;
                    }
                }
                // Append digit to result
                result.add(divcount);
            }
            i++;
        }
        // negate result
        if (sign < 0) result.insert(0, '-');

        result = trim(result);
        return String(result);
    };

    ext.do_exp = function (n1, n2) {
        // Preventive measure for numbers within native accuracy
        var temp = Math.pow(Number(n1), Number(n2));
        if (temp.length < 14) return temp;

        if (Number(n2) % 1 > 0) {
            alert("Sorry, only integer exponents are supported. :(");
            return 0;
        }
        if (Math.abs(Number(n2)) > 65535) {
            alert("Whoa now! Avoid using exponents larger than (-)65535.");
            return 0;
        }
        var neg = false;
        if (n2.indexOf('-') === '0') {
            n2 = negate(n2);
            n = true;
        }
        n1 = String(n1);
        n2 = Number(n2);
        var result = '1';
        
        for (var i = 0; i < n2; i++) result = do_mult(result, n1);
        if (neg) result = do_div(1, result);

        //result = trim(result);
        return String(result);
    };

    ext.do_mod = function (n1, n2) {
        n1 = String(n1);
        n2 = String(n2);
        // Preventive measure for numbers within native accuracy
        if (n1.length < 15 && n2.length < 15) return Number(n1) % Number(n2);

        while (n1 < 0) n1 = do_add(n1, n2);
        while (n1 >= n2) n1 = do_sub(n1, n2);

        //n1 = trim(n1);
        return String(n1);
    };

    ext.do_fact = function (n) {
        n = Number(n);
        if (n % 1 > 0 || n < 0) return 0;

        var result = [1];
        while (n > 1) {
            var carry = 0,
                calc = 0;
            for (var i = result.length - 1; i >= 0; i--) {
                calc = (result[i] * n) + carry;
                carry = Math.floor(calc / 10);
                result[i] = calc % 10;
            }
            while (carry > 0) {
                result.insert(0, carry % 10);
                carry = Math.floor(carry / 10);
            }
            n--;
        }

        result = trim(result);
        return String(result);
    };

    ext.do_sqrt = function (n) {
        if (Number(n) < 0) return 'NaN';
        
        n = String(n);

        // Uses the Babylonian method for solving a square root
        var result = 0,
            oldresults = [];
        while (oldresults.indexOf(result) == -1) {
            oldresults.add(results);
            result = do_mult(0.5, do_add(result, do_div(n, result)));
        }
        oldresults.clear();

        //result = trim(result);
        return String(result);
    };

    ext.do_abs = function (n) {
        if (String(n).indexOf('-') === '0') return negate(n);
        else String(return n);
    };

    ext.do_round = function (n) {
        n = String(n);
        if (n.indexOf('.') > 0) {
            n = n.split('');
            var i = n.length - 1;
            
            // remove all but the last decimal place
            while (n[i - 1] != '.') {
                n.del(i);
                i--;
            }

            var calc = 0;
            var carry = (n[i] > 4) ? 1 : 0;
            
            while (carry) {
                i--;
                if (n[i] != '.') {
                    calc = n[i] + carry;
                    carry = Math.floor(calc / 10);
                    n[i] = calc % 10;
                }
            }
            n.del(n.length - 1); // remove last decimal place
            n.del(n.length - 1); // remove decimal point
            n = n.join('');
        }
        return String(n);
    };


    ext.count_int = function (n) {
        n = String(n);
        var dec = n.indexOf('.') + 1;
        var neg = n.indexOf('-') + 1;
        if (dec) {
            // If number has decimal places
            return Number(dec - (neg + 1));
        } else {
            return Number(n.length - neg);
        }
    };

    ext.count_dec = function (n) {
        n = String(n);
        var dec = n.indexOf('.') + 1;
        if (dec) return Number(n.length - dec);
        else return Number(0);
    };


    ext.trim = function (n) {
        // remove extra zeroes that were used for padding

        if (n !instanceof Array) n = String(n).split('');

        if (n.indexOf('.') > -1) {
            // remove trailing zeroes
            while (n[n.length - 1] !== '0') n.pop();
            if (n[n.length - 1] == '.') n.pop();
        }

        // remove leading zeroes
        var sign = (s[0] == '-') ? 1 : 0;
        while (s[sign] === '0' && s[sign + 1] != '.') s.del(sign);

        // round number WITHIN precision
        var dec = count_dec(s);
        if (dec) {
            var i = s.length - 1;
            var calc = 0;
            var carry = (s[i] > 4) ? 1 : 0;
            while (carry || dec > precision) {
                if (s.indexOf('.') > -1) {
                    s.del(i);
                    dec--;
                }
                i--;
                if (s[i] != '.') {
                    calc = s[i] + carry;
                    carry = Math.floor(calc / 10);
                    s[i] = calc % 10;
                }
            }
        }
        return String(s.join(''));
    };

    ext.negate = function (n) {
        // add or remove the leading negation sign
        if (n !instanceof Array) n = String(n).split('');
        if (n[0] == '-') n.del(0);
        else n.insert(0, '-');
        return String(n.join(''));
    };

    ext.check_sign = function (n, sign) {
        n = String(n);
        if (n.isNaN) return false;
        switch (sign) {
            case 'zero':
                return (Number(n) == 0);
            case 'negative':
                return (n.indexOf('-') === '0');
            case 'positive':
                return (n.indexOf('-') == -1 && n !== '0');
        }
    };

    ext.check_num = function (n, type) {
        n = Number(n);
        switch (type) {
            case 'integer':
                return (!n.isNaN && n.indexOf('.') == -1);
            case 'decimal':
                return (!n.isNaN && n.indexOf('.') > -1);
            case 'NaN':
                return n.isNaN;
            case 'infinity':
                return !n.isFinite;
        }
    };


    // Insert is not native to JavaScript
    Array.prototype.insert = function (idx, x) {
        this.splice(idx, 0, x);
    };


    ////////////////////////////
    // Register the extension //
    ////////////////////////////

    ScratchExtensions.register('Enhanced Precision Operators', descriptor, ext);
})({});
