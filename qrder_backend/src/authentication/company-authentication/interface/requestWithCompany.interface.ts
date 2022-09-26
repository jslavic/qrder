import { Request } from 'express';
import Company from 'src/company/entities/company.entity';

interface RequestWithCompany extends Request {
  company: Company;
}

export default RequestWithCompany;
