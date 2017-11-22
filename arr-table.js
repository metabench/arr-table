var lang = require('lang-mini');
var each = lang.each;
var tof = lang.tof;
var is_arr_of_strs = lang.is_arr_of_strs;

class Array_Table {
    constructor(spec) {
        var t_spec = tof(spec);
        if (t_spec === 'array') {
            var that = this;
            var load_arr_objs = (arr_objs) => {
                //var arr_items = [], arr_values;
                var arr_values;
                that.values = [];
                each(arr_objs, (item) => {
                    if (item) {
                        arr_values = [];
                        each(item, (val) => {
                            arr_values.push(val);
                        });
                        //throw 'stop';
                        that.values.push(arr_values);
                    }
                });
                that.keys = Object.keys(obj_body.result[0]);
                that.data = [that.keys, that.values];
            }

            if (spec.length === 2) {
                // find the keys.
                if (is_arr_of_strs(spec[0])) {
                    this.data = spec;
                    this.keys = spec[0];
                    this.values = spec[1];
                } else {
                    load_arr_objs(spec);
                }
            } else {
                load_arr_objs(spec);
            }
            this.create_map_keys();
            this.fields = this.keys;
            this.records = this.values;
        }
    }

    get length() {
        return this.values.length;
    }

    create_map_keys() {
        var map_keys = this.map_keys = {};
        each(this.keys, (v, i) => {
            map_keys[v] = i;
        });
    }

    get_obj_at(idx) {
        var keys = this.keys;
        var obj = this.values[idx];
        var res = {};
        each(keys, (key, i) => {
            res[keys[i]] = obj[i];
        });
        return res;
    }

    get_new_top_n(n) {
        var new_def = [this.keys, new Array(n)];
        var values = this.values;
        for (var c = 0; c < n; c++) {
            new_def[1][c] = values[c];
        }
        return new Array_Table(new_def);
    }

    get_arr_field_values(field_name) {
        var i_field = this.map_keys[field_name];
        var res = [];
        each(this.values, (value) => {
            res.push(value[i_field]);
        })
        return res;
    }

    transform_each(fn_transform) {
        var res_vals = [];
        each(this.values, (v) => {
            //console.log('v[i_field]', v[i_field]);
            res_vals.push(fn_transform(v));
        });
        //var ar_res = new Array_Table([this.keys, res_vals]);
        //return ar_res;
        return res_vals;
    }

    select_matching_field_values(field_name, selectable_values) {
        var map_selectable_values;
        if (tof(selectable_values) === 'array') {
            map_selectable_values = jsgui.get_truth_map_from_arr(selectable_values);
        } else {
            map_selectable_values = selectable_values;
        }

        var i_field = this.map_keys[field_name];

        var res_vals = [];
        var that = this;
        //console.log('map_selectable_values', map_selectable_values);
        each(this.values, (v, i) => {
            //console.log('v[i_field]', v[i_field]);
            if (map_selectable_values[v[i_field]]) {
                res_vals.push(v);
            }
        });
        //throw 'stop';
        var ar_res = new Array_Table([this.keys, res_vals]);
        return ar_res;
    }

    select_at_matching_fn(fn_match) {
        var res_vals = [];
        var that = this;
        each(this.values, (v, i) => {
            //console.log('v[i_field]', v[i_field]);
            if (fn_match(v)) {
                res_vals.push(v);
            }
        });
        var ar_res = new Array_Table([this.keys, res_vals]);
        return ar_res;
    }
}

// Arrkv static processing methods...?


module.exports = Array_Table;