import * as Yup from 'yup'

const myDto = Yup.object({
    name: Yup.string().required(),
})

export default myDto
