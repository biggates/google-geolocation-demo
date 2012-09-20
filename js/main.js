/**
 * Javascript cell id locationing 
 * @author biggates
 */
$(document).ready(function(){
    var total_towers = 0;
    var current_index = 0;
    /** 
     * add one cell tower
     */
    var addTower = function(){
        total_towers++;
        current_index++;
        var li_id = 'tower_li_' + current_index;
        var id_cell_id = 'cell_id_' + current_index;
        var id_signal_strength = 'signal_strength_' + current_index;
        var id_lac = 'location_area_code_' + current_index;
        $('#cell_towers_section').append(
            $('<li>').css({
                display: 'none'
            }).attr({
                id: li_id
            }).append(
                $('<label>').attr({
                    'for': id_cell_id
                }).html('cell_id')
            ).append(
                $('<input>').attr({
                    type: 'number',
                    id: id_cell_id,
                    name: 'cell_id',
                    value: 3723
                })
            ).append(
                $('<br />')
            ).append(
                $('<label>').attr({
                    'for': id_lac
                }).html('location_area_code (LAC)')
            ).append(
                $('<input>').attr({
                    type: 'number',
                    id: id_lac,
                    name: 'location_area_code',
                    value: 9779
                })
            ).append(
                $('<br />')
            ).append(
                $('<label>').attr({
                    'for': id_signal_strength
                }).html('signal_strength (dBm)')
            ).append(
                $('<input>').attr({
                    type: 'number',
                    id: id_signal_strength,
                    name: 'signal_strength',
                    value: -74
                })
            ).append(
                $('<br />')
            ).append(
                $('<a>').attr({
                    href: 'javascript:;'
                }).addClass('button')
                .html('remove')
                .click(function(){
                    $('#' + li_id).slideUp('slow', function(){$(this).remove();});
                    total_towers--;
                })
            ).slideDown()
        );
    };
    $('#button_add_tower').click(addTower);
    /* add a default cell tower */
    addTower();
    $('#draw_gps').click(function(){
        var lat = $('#gps_latitude').val();
        var lon = $('#gps_longitude').val();
        var acc = parseInt($('#gps_pdop').val());
        var color = 'green';
        var info = {cell_id: 'GPS : ' + lat + ',' + lon};
        addMarker(lat, lon, acc, color, info);
    });
    
    /**
     * Getting the request body from the form
     */
    var getData = function(){
        var result = {};
        var val = function(elem, name){
            var type = elem.attr('type');
            if(type == 'checkbox'){
                if(elem.attr('checked') == 'checked'){
                    return true;
                }
            } else if(name != undefined){
                var v = elem.val();
                if(type == 'number'){
                    v = parseInt(v);
                }
                return v;
            }
            return undefined;
        };
        $('#basic_settings > input').each(function(index){
            var name = $(this).attr('name');
            var value = val($(this), name);
            if(value != undefined){
                result[name] = value;
            }
        });
        var cells = [];
        $('#cell_towers_section li').each(function(index){
            var tower = {};
            $(this).children('input').each(function(){
                var name = $(this).attr('name');
                var v = val($(this), name);
                if(name != undefined && v != undefined){
                    tower[name] = v;
                }
            });
            if(tower.cell_id != undefined){
                cells.push(tower);
            }
        });
        result.cell_towers = cells;
        return result;
    };
    
    /**
     * initialize google map
     */
    var map = undefined;
    var markers = [];
    var listeners = [];
    var initMap = function(latitude, longitude){
        if(map !== undefined){
            return;
        }
        if(latitude == undefined){
            /* hack: no params, using default value */
            latitude = 22.587505;
            longitude = 113.854960;
        } else if (longitude == undefined){
            /* hack: given one param, means latitude is browser's geolocation object */
            longitude = latitude.coords.longitude;
            latitude = latitude.coords.latitude;
        }
        map = new google.maps.Map(document.getElementById('map_canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            zoom: 15,
            streetViewControl: false,
            panControl: false,
            center: new google.maps.LatLng(latitude, longitude)
        });
    };
    
    /**
     * add a marker on the map
     * @param lat the latitude of the center
     * @param lon the longitude of the center
     * @param acc the accuracy of the center, in meters
     * @param info contains the information
     */
    var addMarker = function(lat, lon, acc, color, info){
        if(map == undefined){
            setTimeOut(function(){
                addMarker(lat, lon, acc, color, info)
            }, 4000);
            return;
        }
        var center = new google.maps.LatLng(lat, lon);
        if(color == undefined){
            color = '#FF0000';
        }
        map.panTo(center);
        if(acc != undefined){
            var largeCircle = new google.maps.Circle({
                clickable: false,
                editble: false,
                strokeColor: color,
                strokeOpacity: 0.7,
                strokeWeight: 1,
                fillColor: color,
                fillOpacity: 0.1,
                map: map,
                center: center,
                radius: acc
            });
            markers.push(largeCircle);
        }
        var markerOption = {
            map: map,
            position: center,
            draggable: false,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 3,
                fillColor: color,
                fillOpacity: 1
            },
            animation: google.maps.Animation.DROP,
            title: ''
        };
        if(info != undefined){
            markerOption.title += 'cell_id: ' + info.cell_id + '\n';
        }
        if(acc != undefined){
            markerOption.title += 'accuracy: ' + acc + '\n';
        }
        var smallMarker = new google.maps.Marker(markerOption);
        markers.push(smallMarker);
       
        /* popup window on marker */
        if(info != undefined){
            var infoWindow = new google.maps.InfoWindow({
                content: '<div id="content">' + 
                    '<p>' + 
                    'cell_id: ' + info.cell_id +
                    '</p>' + 
                    '<p>' + 
                    'accuracy: ' + acc +
                    '</p>' + 
                    '</div>'
            });
            var l = google.maps.event.addListener(smallMarker, 'click', function(){
                infoWindow.open(map, smallMarker);
            });
            listeners.push(l);
        }
    };
    
    /**
     * clear all the markers
     */
    var clearMap = function(){
        if(markers){
            for(i in markers){
                markers[i].setMap(null);
            }
            markers = [];
        }
        if(listeners){
            for(i in listeners){
                google.maps.event.removeListener(listeners[i]);
            }
            listeners = [];
        }
    };
    
    /**
     * handling post
     */
    $('#form_submit').click(function(event){
        var result = $('#post_result');
        result.html('posting...');
        var data = getData();
        
        /*/
        $.ajax('test.php', {
        /*/
        $.ajax('post.php', {
        //*/
            async: true,
            cache: false,
            dataType: 'json',
            type: 'POST',
            crossDomain: true,
            statusCode: {
                200: function(d, status, jqXHR){
                    result.html(JSON.stringify(d));
                    if(d == undefined){
                        return;
                    }
                    for(idx in d){
                        var lat = d[idx].latitude;
                        var lon = d[idx].longitude;
                        var acc = d[idx].accuracy;
                        initMap();
                        addMarker(lat, lon, acc, 'red', d[idx]);                        
                    }
                }
            },
            error: function(jqXHR, textStatus, errorThrown){
                result.html(textStatus);
            },
            data: JSON.stringify(data)
        });
        return false;
    });
    /* initialize the map on page load */
    
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(initMap, initMap);
    } else {
        initMap();
    }
    
    /* toggle display of basic settings */
    $('#toggle_basic_settings').click(function(){
        $('#basic_settings').slideToggle();
    }).toggle(function(){
        $(this).html('-');
    }, function(){
        $(this).html('+');
    });
    
    $('#test_map').click(function(){
        initMap();
        addMarker(22.587505, 113.854960, 799, 'red', {cell_id: 3723});
    });
    
    $('#clear_markers').click(function(){
        clearMap();
    });
});
