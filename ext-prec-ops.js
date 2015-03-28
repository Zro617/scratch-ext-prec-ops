/* @name          EnhancedPrecisionOperators
 * @author        Zach R (Zro617/Zro716)
 * @version       1.0.9
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
 *
 *
 *  These methods are to compensate for the lack of functionality with Arrays
 *  ~ Array.prototype.insert
 *  ~ Array.prototype.del
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */


(function (ext) {
    // extension fields
    var pi = '3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
    var precision = 20;

    // blocks to be added
    var descriptor = {
        blocks: [
            ['r', 'pi', 'get_pi'],
            ['r', 'precision', 'get_precision'],
            ['b', 'installed EPO extension?', 'installed'],
            ['b', '%s is %m.PosNegZero ?', 'check_sign', '', 'negative'],
            ['b', '%s is %m.IntDecNaNInf ?', 'check_num', '', 'integer'],
            [' ', 'set max precision to %n digits', 'set_max_precision', 50],
            [' ', 'calculate pi to %n digits', 'calc_pi', 100],
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
            ['r', 'integer places of %s', 'count_int', ''],
            ['r', 'decimal places of %s', 'count_dec', ''],
            ['r', 'negate %s', 'negate', ''],
            ['r', 'trim %s', 'trim', '']
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
    ext.get_pi = function () { return pi; };
    ext.get_precision = function () { return precision; };
    ext.installed = function () { return true; };

    // setters
    ext.set_max_precision = function (digits) {
        if (digits < 0) precision = 0;
        //else if (digits > 10240) precision = 10240;
        else precision = Math.round(digits);
    };

    // http://en.wikipedia.org/wiki/Gauss-Legendre_algorithm
    ext.calc_pi = function (digits) {
        if (digits < 0) return 0;

        var oldprecision = precision;
        set_max_precision(digits);
        if (pi.length - 2 == precision) return pi;
        
        var oldpi = pi;
        pi = 0;

        var a = 1, an, ab;
        var b = do_div(1, do_sqrt(2));
        var t = 0.25;
        var p = 1;

        while (pi != oldpi) {
            pi = oldpi;

            an = do_div(do_add(a, b), 2);
            b  = do_sqrt(do_mult(a, b));
            ab = do_mult(a, b);
            t  = do_sub(t, do_mult(p, do_mult(ab, ab)));
            p  = do_mult(p, 2);
            a  = an;

            ab = do_add(a, b);
            oldpi = do_div(do_mult(ab, ab), do_mult(4, t));
        }

        precision = oldprecision;
    };

    ///////////////////////////////////
    // Enhanced arithmetic functions //
    ///////////////////////////////////

    ext.do_add = function (n1, n2) {
        n1 = n1.toString();
        n2 = n2.toString();
        
        // Preventive measure for numbers within native accuracy
        if (n1.length < 14 && n2.length < 14) return Number(n1) + Number(n2);

        // determine placements of the decimals and count integer places vs decimal places
        var n1_intCount = count_int(n1);
        var n1_decCount = count_dec(n1);
        var n1_signed = (n1.indexOf('-') == 0);
        var n2_intCount = count_int(n2);
        var n2_decCount = count_dec(n2);
        var n2_signed = (n2.indexOf('-') == 0);

        // convert to arrays with chars reversed
        n1 = n1.split('').reverse();
        n2 = n2.split('').reverse();

        // remove negation signs
        if (n1_signed) n1.pop();
        if (n2_signed) n2.pop();

        // remove decimal points
        if (n1_decCount) n1.del(n1_decCount);
        if (n2_decCount) n2.del(n2_decCount);

        // align summands
        while (n1_intCount != n2_intCount && n1_decCount != n2_decCount) {
            if (n1_intCount > n2_intCount) {
                n2.push(0);
                n2_intCount++;
            } else if (n2_intCount > n1_intCount) {
                n1.push(0);
                n1_intCount++;
            }
            if (n1_decCount > n2_decCount) {
                n2.unshift(0);
                n2_decCount++;
            } else if (n2_decCount > n1_decCount) {
                n1.unshift(0);
                n1_decCount++;
            }
        }

        // perform parallel digit-wise addition or subtraction

        var result = [], calc = 0, carry = 0, idx = 0;

        for (idx = 0; idx < n1.length; idx++) {
            if (n1_signed == n2_signed) {
                calc = n1[idx] + n2[idx] + carry;
            } else if (n1_signed) {
                calc = n2[idx] - n1[idx] + carry;
            } else {
                calc = n1[idx] - n2[idx] + carry;
            }
            carry = Math.floor(calc / 10);
            result.push(calc % 10);
        }
        
        // add another digit if needed
        if (carry) result.push(carry);

        // insert decimal point if needed
        if (n1_decCount) result.insert(n1_decCount, '.');

        // check if the result should be negative
        if (n1_signed == n2_signed) {
            if (n1_signed) result.push('-');
        } else if (carry < 0) {
            carry = 0;
            for (idx = 0; idx < result.length; idx++) {
                if (result[idx] != '.') {
                    calc = carry - result[idx];
                    carry = Math.floor(calc / 10);
                    result[idx] = calc % 10;
                }
            }
            result.push('-');
        }
        
        result = result.reverse();
        result = trim(result);
        return result;
    };

    ext.do_sub = function (n1, n2) {
        /* The addition algorithm above works for
         * negative numbers as well, so save some
         * redundant coding and use that instead.
         */
        return do_add(n1, negate(n2));
    };

    ext.do_mult = function (n1, n2) {
        n1 = n1.toString();
        n2 = n2.toString();
        
        // Preventive measure for numbers within native accuracy
        if (n1.length + n2.length < 13) return Number(n1) * Number(n2);
        
        // preparations
        var n1_decCount = count_dec(n1);
        var n1_signed = (n1.indexOf('-') == 0);
        var n2_decCount = count_dec(n2);
        var n2_signed = (n2.indexOf('-') == 0);

        var signed = (n1_signed != n2_signed);

        // convert to arrays
        n1 = n1.split('').reverse();
        n2 = n2.split('').reverse();

        // remove negation signs
        if (n1_signed) n1.pop();
        if (n2_signed) n2.pop();

        // remove decimal points
        if (n1_decCount) n1.del(n1_decCount);
        if (n2_decCount) n2.del(n2_decCount);

        var result = new Array(n1.length + n2.length);
        var n1_digit, n2_digit, r_i;

        // perform long multiplication
        for (var n1_i = 0; n1_i < n1.length; n1_i++) {
            r_i = n1_i;
            n1_digit = n1[n1_i];
            carry = 0;
            for (var n2_i = 0; n2_i < n2.length; n2_i++) {
                n2_digit = n2[n2_i];
                calc = n1_digit * n2_digit + result[r_i] + carry;
                carry = Math.floor(calc / 10);
                result[r_i] = calc % 10;
                r_i++;
            }
            while (r_i < result.length) {
                calc = result[r_i] + carry;
                carry = Math.floor(calc / 10);
                result[r_i] = calc % 10;
                r_i++;
            }
        }
        // insert a decimal point
        var dec = n1_decCount + n2_decCount;
        if (dec) result.insert(dec, '.');

        // negate result
        if (signed) result.push('-');
        
        result.reverse();
        result = trim(result);
        return result;
    };

    ext.do_div = function (n1, n2) {
        if (Number(n2) == 0) return (Number(n1) == 0) ? 'NaN' : 'Infinity';
        if (Number(n1) == 0) return 0;

        n1 = n1.toString().split(''); // Convert to arrays with chars reversed
        n2 = n2.toString().split('');

        // Check if divisor has a decimal point, and if so
        // count the decimal places and shift it by a magnitude
        // until it is an integer.  Extend the numerator with
        // zeroes then move its decimal point equally.

        var i, temp;
        var dec = n2.indexOf('.') + 1;
        if (dec) {
            var decPlaces = n2.length - dec;
            n1.del(dec);
            
            // add zeroes to the right side of the dividend
            for (i = 0; i < decPlaces; i++) n1.push(0);
            
            // move its decimal place
            dec = n1.indexOf('.') + 1;
            if (dec) {
                n2.del(dec);
                n2.insert(n2.length - (dec - decPlaces),'.');
            }
        }

        // Remove negation signs
        var sign = 1;
        if (n1[0] == '-') {
            n1.shift();
            sign *= -1;
        }
        if (n2[0] == '-') {
            n2.shift();
            sign *= -1;
        }
        // convert dividend back to string
        n2 = n2.join('');

        var result = []; // quotient
        var rem = ""; // remainder
        var divcount = 0; // counter for subtractions from remainder
        dec = -1; // decimal places; -1 = no decimal point
        
        for (i = 0;i <n1.length;i++) {
            if (dec + 1) dec++;

            temp = n1[i];
            if (temp == '.') {
                // Decimal place found
                result.push('.');
                dec++;
            } else {
                // Append the next digit to remainder
                rem += temp.toString();
                
                // Do long division
                divcount = 0;
                while (rem > n2) {
                        rem = do_sub(rem, n2);
                        divcount++;
                }
                
                // Append digit to result
                result.push(divcount);
            }
        }
        if (rem > 0) {
            if (dec < 0) {
                result.push('.');
                dec++;
            }
            while (dec < precision && rem > 0) {
                rem += String(0);
                // Do long division
                divcount = 0;
                while (rem > n2) {
                    rem = do_sub(rem, n2);
                    divcount++;
                }
                result.push(divcount);
                dec++;
            }
        }
        // negate result
        if (sign < 0) result.unshift('-');

        result = trim(result);
        return result;
    };

    ext.do_exp = function (n1, n2) {
        // Preventive measure for numbers within native accuracy
        //var temp = Math.pow(Number(n1), Number(n2));
        //if (temp.length < 14) return temp;

        if (Number(n2) % 1 > 0) {
            alert("Sorry, only integer exponents are supported. :(");
            return 0;
        }
        if (Math.abs(Number(n2)) > 65535) {
            alert("Whoa now! Avoid using exponents larger than (-)65535.");
            return 0;
        }
        var neg = false;
        if (n2.indexOf('-') == 0) {
            n2 = negate(n2);
            neg = true;
        }
        n1 = n1.toString();
        n2 = Number(n2);
        
        var result = '1';
        
        for (var i = 0; i < n2; i++) result = do_mult(result, n1);
        if (neg) result = do_div(1, result);

        //result = trim(result);
        return result;
    };

    ext.do_mod = function (n1, n2) {
        n1 = n1.toString();
        n2 = n2.toString();
        
        // Preventive measure for numbers within native accuracy
        if (n1.length < 14 && n2.length < 14) return Number(n1) % Number(n2);

        while (n1 < 0) n1 = do_add(n1, n2);
        while (n1 >= n2) n1 = do_sub(n1, n2);

        //n1 = trim(n1);
        return n1;
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
                result.unshift(carry % 10);
                carry = Math.floor(carry / 10);
            }
            n--;
        }

        result = trim(result);
        return result;
    };

    ext.do_sqrt = function (n) {
        if (Number(n) < 0) return 'NaN';
        
        n = n.toString();

        // Uses the Babylonian method for solving a square root
        var result = 0,oldresults = [];
        while (oldresults.indexOf(result) == -1) {
            oldresults.push(results);
            result = do_mult(0.5, do_add(result, do_div(n, result)));
        }
        oldresults.clear();

        //result = trim(result);
        return result;
    };

    ext.do_abs = function (n) {
        n = n.toString();
        if (n.indexOf('-') == 0) n = negate(n);
        return n;
    };

    ext.do_round = function (n) {
        n = n.toString().split('').reverse();
        if (n.indexOf('.')) {
            
            // remove all but the last decimal place
            while (n[1] != '.') n.shift();
            
            var calc = 0;
            var carry = (n[0] > 4) ? 1 : 0;
            n.shift(); // remove last decimal place
            n.shift(); // remove decimal point
            
            // round
            var i = 0;
            while (carry && i < n.length) {
                calc = n[i] + carry;
                carry = Math.floor(calc / 10);
                n[i] = calc % 10;
                i++;
            }
            if (carry && i == n.length) n.push(carry);
        }
        
        n = n.reverse().join('');
        n = trim(n);
        return n;
    };


    ext.count_int = function (n) {
        n = n.toString();
        var dec = n.indexOf('.') + 1;
        var neg = n.indexOf('-') + 1;
        if (dec) return dec - (neg + 1);
        return n.length - neg;
    };

    ext.count_dec = function (n) {
        n = n.toString();
        var dec = n.indexOf('.') + 1;
        if (dec) return n.length - dec;
        return 0;
    };


    // in need of major work here...
    ext.trim = function (n) {
        // remove extra zeroes that were used for padding
        
        if (n instanceof Array);
        else n = n.toString().split('');

        if (n.indexOf('.') > -1) {
            // remove trailing zeroes
            while (n[n.length - 1] != 0) n.pop();
            if (n[n.length - 1] == '.') n.pop();
        }
        // remove leading zeroes
        var sign = n.indexOf('-') + 1;
        while (n[sign] == 0 && n[sign + 1] != '.') n.del(sign);

        // round number WITHIN precision
        var dec = count_dec(n.join(''));
        if (dec) {
            var i = n.length - 1;
            var calc = 0;
            var carry = (n[i] > 4) ? 1 : 0;
            while (carry || dec > precision) {
                if (n.indexOf('.') > -1) {
                    n.pop();
                    dec--;
                }
                i--;
                if (n[i] != '.') {
                    calc = n[i] + carry;
                    carry = Math.floor(calc / 10);
                    n[i] = calc % 10;
                }
            }
        }
        n = n.join('');
        return n;
    };

    ext.negate = function (n) {
        // add or remove the leading negation sign
        if (n instanceof Array);
        else n = n.toString().split('');
        
        if (n[0] == '-') n.shift();
        else n.unshift('-');
        return n.join('');
    };

    ext.check_sign = function (n, sign) {
        if (n.isNaN) return false;
        switch (sign) {
            case 'zero':
                return (Number(n) == 0);
            case 'negative':
                return (Number(n) < 0);
            case 'positive':
                return (Number(n) > 0);
        }
    };

    ext.check_num = function (n, type) {
        switch (type) {
            case 'integer':
                return (!(n.isNaN) && n.toString().indexOf('.') == -1);
            case 'decimal':
                return (!(n.isNaN) && n.toString().indexOf('.') > -1);
            case 'NaN':
                return Number(n).isNaN;
            case 'infinity':
                return !(Number(n).isFinite);
        }
    };


    // Insert is not native to JavaScript Arrays
    Array.prototype.insert = function (idx, x) {
        this.splice(idx, 0, x);
    };
    
    // Neither is delete
    Array.prototype.del = function(idx) {
        if (idx == this.length - 1) {
            this.pop();
        } else if (idx == 0) {
            this.shift();
        } else if (idx > 0 && idx < this.length) {
            // temp stack
            var temp = [];
            
            if (idx < this.length / 2) {
                // item to delete is in the first half
                
                // push the first item of the Array onto stack
                for (var i = 0; i<idx;i++) {
                    temp.push(this[0]);
                    this.shift();
                }
                // delete item
                this.shift();
                
                // return items to array
                this.concat(temp,this);
            } else {
                // item to delete is in latter half
                
                // unshift the last item of the Array onto stack
                for (var i = this.length - 1;i > idx;i--) {
                    temp.unshift(this[i]);
                    this.pop();
                }
                // delete item
                this.pop();
                
                // return items to array
                this.concat(this,temp);
            }
        }
    }

    ////////////////////////////
    // Register the extension //
    ////////////////////////////

    ScratchExtensions.register('Enhanced Precision Operators', descriptor, ext);
})({});
