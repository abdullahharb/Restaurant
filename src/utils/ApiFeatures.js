
export class ApiFeatures {

    constructor(mongooseQuery, QueryString) {
        this.mongooseQuery = mongooseQuery
        this.QueryString = QueryString
    }


    // 1- pagination
    paginate() {
        let page = this.QueryString.page * 1 || 1
        if (page <= 0) page = 1
        let SKIP = (page - 1) * 5
        this.page = page
        this.mongooseQuery.skip(SKIP).limit(5)
        return this
    }

    // 2- filter
    filter() {
        let filterObj = { ...this.QueryString }
        let excludedQuery = ['page', 'sort', 'fields', 'keyword']
        excludedQuery.forEach((q) => {
            delete filterObj[q]
        })
        filterObj = JSON.stringify(filterObj)
        filterObj = filterObj.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        filterObj = JSON.parse(filterObj)
        this.mongooseQuery.find(filterObj)
        return this
    }

    // 3- sort
    sort() {
        if (this.QueryString.sort) {
            let sortedBy = this.QueryString.sort.split(',').join(' ')
            this.mongooseQuery.sort(sortedBy)
        }
        return this
    }

    // 4- search
    search() {
        if (this.QueryString.keyword) {
            this.mongooseQuery.find(
                {
                    $or:
                        [
                            { name: { $regex: this.QueryString.keyword, $options: 'i' } },
                            { title: { $regex: this.QueryString.keyword, $options: 'i' } },
                            { description: { $regex: this.QueryString.keyword, $options: 'i' } }
                        ]
                }
            )
        }
        return this;
    }

    // 5- selected fields
    fields() {
        if (this.QueryString.fields) {
            let fields = this.QueryString.fields.split(',').join(' ')
            this.mongooseQuery.select(fields)
        }
        return this;
    }

}