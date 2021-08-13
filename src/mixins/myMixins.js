export default {
    mounted(){
        console.log(0);
    },
    methods: {
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.rows = val;
            this.getList();
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.page = val;
            this.getList();
        }
    },
};