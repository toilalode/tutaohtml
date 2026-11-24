'use strict';
(function(){
const KEYS=['tm_save_v1','tm_dungeon_v1','tm_pt_v1'];
const wipe=()=>{for(const k of KEYS){try{localStorage.removeItem(k)}catch(e){}}};
window.resetSave=()=>{wipe();addEventListener('pagehide',wipe);location.reload()};
})();
