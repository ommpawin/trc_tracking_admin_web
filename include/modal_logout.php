<div class="modal fade" id="logoutModal" tabindex="4" role="dialog" aria-labelledby="logoutModalTitle" aria-hidden="true" data-keyboard="false" data-backdrop="static">
    <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title font-weight-norma using-custom-font"><i class="fas fa-sign-out-alt"></i> ออกจากระบบ</h5>
                <button type="button" class="close text-danger" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div>
                    <p class="using-custom-font text-center pl-2 pr-2 mt-3 mb-3">คุณต้องการ <span class="text-danger">ออกจากระบบ TRC Tracking</span> หรือไม่ ?</p>
                </div>
            </div>
            <div class="modal-footer" id="modelVerifyFooter">
                <button type="button" class="btn btn-danger using-custom-font" onclick="LogoutSystem()"><i class="fas fa-sign-out-alt"></i> ออกจากระบบ</button>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="/TRC_Tracking/src/js/access_system/logout.js"></script>